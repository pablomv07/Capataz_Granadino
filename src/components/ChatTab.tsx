import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowRight,
  Compass,
  BookOpen,
  Music,
  Share2,
  Bell,
  Church,
  ExternalLink,
  History,
  Trash2,
  Star,
  Search,
  X,
  Globe,
  MapPin,
  Clock,
  Radio,
  Bookmark
} from 'lucide-react';
import { cofradeAudio } from '../utils/audio';
import { HERMANDADES_GRANADA, Hermandad } from '../data/hermandades';

export interface GroundingSource {
  title: string;
  uri: string;
  type: 'web' | 'map';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  followUps?: string[];
  menciones?: string[];
  groundingSources?: GroundingSource[];
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  dateStr: string;
  category: 'hermandad' | 'itinerario' | 'horario' | 'rincon' | 'historia' | 'general';
  pinned?: boolean;
}

interface ChatTabProps {
  brevityMode: 'ultra' | 'conciso' | 'detallado';
  setBrevityMode: (mode: 'ultra' | 'conciso' | 'detallado') => void;
  onSelectHermandad?: (hermandadId: string) => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  { text: '¿Cuándo sale La Aurora y sus puntos clave en el Albayzín?' },
  { text: '¿Por dónde y a qué hora ver Los Gitanos en el Sacromonte?' },
  { text: '¿Quién es El Greñúo y cuál es su recorrido el Lunes Santo?' },
  { text: '¿Cuál es el recorrido oficial de la Carrera Oficial de Granada?' },
  { text: '¿Qué hace tan especial al Cristo del Silencio por el Darro?' },
  { text: '¿Qué ocurre a las tres de la tarde el Viernes Santo en el Campo del Príncipe?' },
  { text: '¿Cómo y a qué hora desciende Santa María de la Alhambra?' },
  { text: '¿Quiénes son Las Chías en la Soledad de San Jerónimo?' }
];

function categorizeQuery(q: string): QueryHistoryItem['category'] {
  const lower = q.toLowerCase();
  if (lower.includes('hora') || lower.includes('cuándo') || lower.includes('tiempo') || lower.includes('salida') || lower.includes('recogida')) {
    return 'horario';
  }
  if (lower.includes('itinerario') || lower.includes('recorrido') || lower.includes('calle') || lower.includes('carrera oficial') || lower.includes('ganivet')) {
    return 'itinerario';
  }
  if (lower.includes('rincón') || lower.includes('rincon') || lower.includes('mirador') || lower.includes('cuesta') || lower.includes('darro') || lower.includes('puente')) {
    return 'rincon';
  }
  if (lower.includes('historia') || lower.includes('origen') || lower.includes('imaginero') || lower.includes('mora') || lower.includes('chías')) {
    return 'historia';
  }
  return 'hermandad';
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  brevityMode, 
  setBrevityMode, 
  onSelectHermandad,
  initialPrompt 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: '¡A esta es, devoto! Soy **El Capataz Granadino**, tu IA experta en la Semana Santa de Granada. Pregúntame sobre horarios, calles, las **32 hermandades federadas**, la **Carrera Oficial** o secretos del **Albayzín** y el **Realejo**.\n\n*Mis respuestas son directas, rigurosas y concisas, sin rodeos.* ¿Qué cofradía o rincón quieres consultar?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUps: [
        '¿A qué hora sale La Aurora el Jueves Santo?',
        '¿Qué cofradías procesionan el Miércoles Santo?',
        '¿Cuál es el recorrido de la Carrera Oficial?'
      ]
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [enfoque, setEnfoque] = useState<'general' | 'rutas' | 'historia' | 'musica'>('general');
  const [isDrumActive, setIsDrumActive] = useState(false);

  // Grounding toggles (Search Grounding & Maps Grounding via Gemini 3.8 Flash)
  const [searchGrounding, setSearchGrounding] = useState<boolean>(true);
  const [mapsGrounding, setMapsGrounding] = useState<boolean>(true);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Search History Drawer State
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyCategory, setHistoryCategory] = useState<string>('todas');

  // Search History stored in localStorage
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('capataz_query_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    // Default initial historical cofrade queries
    return [
      {
        id: 'hist-def-1',
        query: '¿A qué hora sale La Aurora y cómo es el paso por los Grifos de San José?',
        timestamp: '18:30',
        dateStr: 'Hoy',
        category: 'itinerario',
        pinned: true
      },
      {
        id: 'hist-def-2',
        query: '¿Cuál es el itinerario de Los Gitanos por el Camino del Sacromonte?',
        timestamp: '17:45',
        dateStr: 'Hoy',
        category: 'itinerario',
        pinned: true
      },
      {
        id: 'hist-def-3',
        query: '¿Qué ocurre a las tres de la tarde el Viernes Santo en el Campo del Príncipe?',
        timestamp: '16:15',
        dateStr: 'Ayer',
        category: 'horario',
        pinned: false
      },
      {
        id: 'hist-def-4',
        query: '¿Quiénes son Las Chías de la Soledad de San Jerónimo?',
        timestamp: '12:00',
        dateStr: 'Ayer',
        category: 'historia',
        pinned: false
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external initial prompt if sent from other tabs
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      cofradeAudio.stopAll();
    };
  }, []);

  // Save query history to localStorage
  const saveHistoryToStorage = (items: QueryHistoryItem[]) => {
    setQueryHistory(items);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('capataz_query_history', JSON.stringify(items));
      } catch (e) {
        console.warn('Failed saving query history:', e);
      }
    }
  };

  const addQueryToHistory = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const newItem: QueryHistoryItem = {
      id: `hist-${Date.now()}`,
      query: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: 'Hoy',
      category: categorizeQuery(trimmed),
      pinned: false,
    };

    setQueryHistory((prev) => {
      const filtered = prev.filter(h => h.query.toLowerCase() !== trimmed.toLowerCase());
      const updated = [newItem, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('capataz_query_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleTogglePinHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = queryHistory.map(item => 
      item.id === id ? { ...item, pinned: !item.pinned } : item
    );
    saveHistoryToStorage(updated);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = queryHistory.filter(item => item.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm('¿Deseas vaciar todo el historial de búsquedas cofrades?')) {
      saveHistoryToStorage([]);
    }
  };

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return queryHistory
      .filter(item => {
        const matchesCategory = 
          historyCategory === 'todas' ? true :
          historyCategory === 'fijadas' ? item.pinned :
          item.category === historyCategory;

        const term = historySearch.toLowerCase().trim();
        const matchesSearch = !term || item.query.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Pinned first, then newest
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
  }, [queryHistory, historyCategory, historySearch]);

  // Audio Recording & Transcription with gemini-3.5-transcribe
  const toggleAudioRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMicNotice('El navegador de tu dispositivo no admite grabación de audio.');
          setTimeout(() => setMicNotice(null), 4000);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          if (audioBlob.size > 500) {
            setTranscribing(true);
            try {
              // Convert blob to base64
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async () => {
                const base64Data = (reader.result as string).split(',')[1];
                if (base64Data) {
                  const res = await fetch('/api/transcribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      audioBase64: base64Data,
                      mimeType: 'audio/webm'
                    })
                  });

                  if (res.ok) {
                    const data = await res.json();
                    if (data.transcript) {
                      setInput(data.transcript);
                    }
                  }
                }
                setTranscribing(false);
              };
            } catch (err) {
              console.error('Transcription error:', err);
              setTranscribing(false);
            }
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
        setIsRecording(false);
      }
    }
  };

  // Text-to-speech using Gemini TTS or Web Speech API
  const speakText = async (text: string, messageId: string) => {
    if (currentlySpeakingId === messageId) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(messageId);

    // Try Gemini TTS endpoint first
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
          audio.onended = () => setCurrentlySpeakingId(null);
          audio.onerror = () => fallbackWebSpeech(text);
          audio.play();
          return;
        }
      }
    } catch {
      // Fallback
    }

    fallbackWebSpeech(text);
  };

  const fallbackWebSpeech = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    cofradeAudio.playLlamador(false);
    addQueryToHistory(query);

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation payload
      const validTurns = newMessages.filter(
        (msg) => !msg.id.startsWith('err-') && !msg.id.startsWith('init-')
      );

      const conversationHistory = validTurns.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory.length > 0 ? conversationHistory : [{ role: 'user', content: query }],
          brevity: brevityMode,
          enfoque: enfoque,
          searchGrounding,
          mapsGrounding,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en servidor: ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || '¡Oído a la voz! No he podido encontrar los datos exactos en esta chicotá.';

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: data.followUps || [],
        menciones: data.menciones || [],
        groundingSources: data.groundingSources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      cofradeAudio.playLlamador(true);

      if (ttsEnabled) {
        speakText(replyContent, assistantMessage.id);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '¡Oído! Ha habido un leve enganche de red en el paso. Intenta consultarme de nuevo, costalero.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (text: string) => {
    const cleanText = text.replace(/[*#_]/g, '');
    const url = `https://wa.me/?text=${encodeURIComponent(cleanText + '\n\n— Vía El Capataz Granadino')}`;
    window.open(url, '_blank');
  };

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: 'init-cleared',
        role: 'assistant',
        content: '¡A esta es! Se inicia nueva chicotá. Pregúntame lo que necesites sobre la Semana Santa de Granada con respuestas concisas y claras.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: [
          '¿Qué cofradías salen el Jueves Santo?',
          '¿Cuál es el horario del Cristo de los Favores?',
          '¿Qué itinerario tiene La Borriquilla?'
        ]
      },
    ]);
  };

  const toggleDrum = () => {
    cofradeAudio.toggleTamborLoop((playing) => {
      setIsDrumActive(playing);
    });
  };

  // Render markdown with rich styling
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const formattedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-[var(--accent-gold)] font-bold">$1</strong>'
      );

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const bulletText = formattedLine.replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-[var(--text-primary)] my-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: bulletText }} />
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1.5 text-[var(--text-primary)] leading-relaxed font-sans text-xs sm:text-sm">
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] max-w-5xl mx-auto editorial-card rounded-2xl shadow-sm overflow-hidden border border-[var(--border-subtle)] transition-colors duration-300">
      
      {/* Top Toolbar: Brevity, Focus, Grounding Toggles & Search History Button */}
      <div className="bg-[var(--bg-card-subtle)] border-b border-[var(--border-subtle)] px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Brevity Level & Enfoque */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Brevity */}
          <div className="flex bg-[var(--bg-app)] p-0.5 rounded-xl border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setBrevityMode('ultra')}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                brevityMode === 'ultra'
                  ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Ultra</span>
            </button>
            <button
              onClick={() => setBrevityMode('conciso')}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                brevityMode === 'conciso'
                  ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Conciso</span>
            </button>
            <button
              onClick={() => setBrevityMode('detallado')}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                brevityMode === 'detallado'
                  ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Detallado</span>
            </button>
          </div>

          {/* Enfoque pills */}
          <div className="hidden sm:flex bg-[var(--bg-app)] p-0.5 rounded-xl border border-[var(--border-subtle)] text-[11px]">
            <button
              onClick={() => setEnfoque('general')}
              className={`px-2 py-0.5 rounded-lg transition font-medium ${
                enfoque === 'general' ? 'bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setEnfoque('rutas')}
              className={`px-2 py-0.5 rounded-lg transition font-medium ${
                enfoque === 'rutas' ? 'bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Rutas
            </button>
            <button
              onClick={() => setEnfoque('historia')}
              className={`px-2 py-0.5 rounded-lg transition font-medium ${
                enfoque === 'historia' ? 'bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Historia
            </button>
          </div>
        </div>

        {/* Right: Search History Button & Grounding Toggles */}
        <div className="flex items-center gap-2">
          {/* Search Grounding toggle */}
          <button
            onClick={() => setSearchGrounding(!searchGrounding)}
            className={`px-2 py-1 rounded-lg text-[10px] font-cinzel font-semibold flex items-center gap-1 border transition ${
              searchGrounding
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
            title="Activar Google Search Grounding en tiempo real"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden md:inline">Google Search</span>
          </button>

          {/* Maps Grounding toggle */}
          <button
            onClick={() => setMapsGrounding(!mapsGrounding)}
            className={`px-2 py-1 rounded-lg text-[10px] font-cinzel font-semibold flex items-center gap-1 border transition ${
              mapsGrounding
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
            title="Activar Google Maps Grounding para Granada"
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden md:inline">Google Maps</span>
          </button>

          {/* Search History Drawer Trigger */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-2.5 py-1 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 border transition shadow-xs ${
              showHistory
                ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] border-amber-600'
                : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
            }`}
            title="Ver historial de búsquedas cofrades"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historial</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
              {queryHistory.length}
            </span>
          </button>

          {/* Clear chat */}
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-app)] transition border border-transparent hover:border-[var(--border-subtle)]"
            title="Comenzar nueva chicotá (limpiar conversación)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Search History Drawer */}
      {showHistory && (
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-strong)] p-3 sm:p-4 shadow-inner space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--accent-gold)]" />
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Historial de Consultas & Itinerarios Anteriores
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {queryHistory.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="text-[11px] font-cinzel text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Vaciar Historial</span>
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar inside history & Category filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Filtrar tus consultas previas (Aurora, Ganivet, Silencio...)..."
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] font-serif-book"
              />
            </div>

            <div className="sm:col-span-6 flex items-center gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'fijadas', label: '⭐ Guardadas' },
                { id: 'itinerario', label: 'Itinerarios' },
                { id: 'hermandad', label: 'Hermandades' },
                { id: 'horario', label: 'Horarios' },
                { id: 'rincon', label: 'Rincones' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setHistoryCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-cinzel whitespace-nowrap transition ${
                    historyCategory === cat.id
                      ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-bold'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* History Items Grid */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--text-muted)] font-serif-book">
                No se encontraron consultas para este filtro. Pregunta algo al Capataz y se guardará automáticamente aquí.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleSendMessage(item.query);
                    setShowHistory(false);
                  }}
                  className="group p-2 sm:p-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={(e) => handleTogglePinHistory(item.id, e)}
                      className={`p-1 rounded hover:bg-[var(--bg-app)] transition shrink-0 ${
                        item.pinned ? 'text-amber-500' : 'text-[var(--text-muted)] hover:text-amber-500'
                      }`}
                      title={item.pinned ? 'Desfijar consulta' : 'Fijar como favorita'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.pinned ? 'fill-amber-500' : ''}`} />
                    </button>

                    <div className="min-w-0">
                      <p className="font-serif-book text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition truncate">
                        {item.query}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                        <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--accent-gold)]">
                          {item.category}
                        </span>
                        <span>{item.dateStr} · {item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInput(item.query);
                        setShowHistory(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-[var(--bg-app)] hover:bg-[var(--accent-gold)] hover:text-white text-[10px] font-cinzel font-semibold text-[var(--text-secondary)] transition opacity-0 group-hover:opacity-100"
                      title="Editar en el campo de texto"
                    >
                      Cargar
                    </button>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const isSpeaking = currentlySpeakingId === message.id;

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`rounded-2xl p-4 sm:p-5 shadow-sm text-sm relative transition-colors ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 font-serif-book rounded-tr-xs shadow-md border border-amber-600/30'
                    : 'cofrade-card rounded-2xl rounded-tl-xs w-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                }`}
              >
                {/* Header label for assistant */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--border-subtle)] text-xs">
                    <span className="font-cinzel text-[var(--accent-gold)] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span>El Capataz Granadino</span>
                    </span>

                    <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <span className="text-[10px] font-mono">{message.timestamp}</span>
                      <button
                        onClick={() => speakText(message.content, message.id)}
                        className={`p-1.5 rounded-lg transition ${
                          isSpeaking ? 'text-[var(--accent-gold)] bg-amber-500/20' : 'hover:text-[var(--accent-gold)]'
                        }`}
                        title={isSpeaking ? 'Detener voz' : 'Escuchar respuesta con voz de Capataz'}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopyText(message.content, message.id)}
                        className="p-1.5 rounded-lg hover:text-[var(--accent-gold)] transition"
                        title="Copiar texto"
                      >
                        {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Body Content */}
                <div className="leading-relaxed font-serif-book">
                  {isUser ? message.content : renderFormattedContent(message.content)}
                </div>

                {/* Grounding Sources (Google Search & Google Maps verified places) */}
                {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] space-y-1.5">
                    <span className="text-[10px] font-cinzel font-semibold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[var(--accent-gold)]" />
                      Fuentes verificadas (Google Search & Maps):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {message.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition font-serif-book"
                        >
                          {source.type === 'map' ? <MapPin className="w-2.5 h-2.5 text-emerald-500" /> : <Globe className="w-2.5 h-2.5 text-blue-500" />}
                          <span className="truncate max-w-[200px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentioned Brotherhoods Badges */}
                {!isUser && message.menciones && message.menciones.length > 0 && onSelectHermandad && (
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-cinzel text-[var(--text-muted)] mr-1">Cofradías citadas:</span>
                    {message.menciones.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectHermandad(m)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold-bg)] hover:bg-[var(--accent-gold)] hover:text-white border border-[var(--border-strong)] text-[var(--accent-gold)] text-[11px] font-cinzel font-semibold flex items-center gap-1 transition"
                      >
                        <Church className="w-3 h-3" />
                        <span>Ver Ficha</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up suggestion pills */}
              {!isUser && message.followUps && message.followUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                  {message.followUps.map((fu, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSendMessage(fu)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-1 font-serif-book"
                    >
                      <span>{fu}</span>
                      <ArrowRight className="w-3 h-3 text-[var(--accent-gold)]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] max-w-sm text-xs font-serif-book text-[var(--text-secondary)] animate-pulse">
            <Sparkles className="w-4 h-4 text-[var(--accent-gold)] animate-spin" />
            <span>Consultando el callejero y crónicas de Granada...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Strip */}
      <div className="px-3 sm:px-5 py-2 bg-[var(--bg-card-subtle)] border-t border-[var(--border-subtle)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-cinzel font-bold text-[var(--accent-gold)] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Bookmark className="w-3 h-3" /> Sugeridas:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.text)}
            className="px-2.5 py-1 rounded-lg bg-[var(--bg-app)] hover:bg-[var(--accent-gold)] hover:text-white border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-gold-contrast)] whitespace-nowrap transition font-serif-book shrink-0"
          >
            {qp.text}
          </button>
        ))}
      </div>

      {/* Recording status bar */}
      {isRecording && (
        <div className="bg-red-500/10 border-t border-red-500/20 px-4 py-2 flex items-center justify-between text-xs text-red-600 dark:text-red-400 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-cinzel font-bold">Grabando audio... Habla claramente sobre una cofradía o calle.</span>
          </div>
          <button
            onClick={toggleAudioRecording}
            className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-cinzel font-bold text-[11px]"
          >
            Detener & Transcribir
          </button>
        </div>
      )}

      {/* Transcribing status */}
      {transcribing && (
        <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-1.5 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Transcribiendo voz con Gemini 3.5 Transcribe...</span>
        </div>
      )}

      {/* Mic Warning Notice Banner */}
      {micNotice && (
        <div className="bg-amber-500/15 border-t border-amber-500/30 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between font-serif-book">
          <span>{micNotice}</span>
          <button 
            onClick={() => setMicNotice(null)}
            className="text-xs font-bold underline ml-2"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone button (Audio Transcription with gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={toggleAudioRecording}
            disabled={loading || transcribing}
            className={`p-2.5 rounded-xl border transition shadow-xs shrink-0 ${
              isRecording
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
            }`}
            title="Dictar pregunta con micrófono (transcrito con Gemini 3.5 Transcribe)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a El Capataz sobre horarios, calles, templos, cofradías..."
            disabled={loading || isRecording || transcribing}
            className="flex-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition font-serif-book"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || loading || isRecording}
            className="px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] hover:opacity-95 disabled:opacity-50 transition shadow-xs shrink-0 flex items-center gap-1.5 font-cinzel font-bold text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preguntar</span>
          </button>
        </form>
      </div>

    </div>
  );
};
