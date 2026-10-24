import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Square, 
  Search, 
  Radio, 
  Flame, 
  Award, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Volume2,
  Tv,
  Disc,
  Headphones,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { MARCHAS_GRANADINAS, MarchaCofrade } from '../data/marchas';
import { realCofradePlayer, RealPlayerState } from '../utils/realPlayerState';
import { cofradeAudio } from '../utils/audio';

interface MarchasTabProps {
  onAskCapataz: (query: string) => void;
}

export const MarchasTab: React.FC<MarchasTabProps> = ({ onAskCapataz }) => {
  const [selectedGenero, setSelectedGenero] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [playerState, setPlayerState] = useState<RealPlayerState>({
    isPlaying: false,
    activeMarcha: MARCHAS_GRANADINAS[0],
    playerMode: 'video'
  });

  const playerDeckRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = realCofradePlayer.subscribe(setPlayerState);
    return unsub;
  }, []);

  const generos = [
    'Todos', 
    'Banda de Música (Palio)', 
    'Agrupación Musical', 
    'Cornetas y Tambores', 
    'Capilla / Fúnebre'
  ];

  const handlePlayRealMarcha = (marcha: MarchaCofrade) => {
    cofradeAudio.playLlamador(false);
    realCofradePlayer.play(marcha);

    // Smooth scroll up to player if it is out of view
    if (playerDeckRef.current) {
      playerDeckRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStopRealMarcha = () => {
    realCofradePlayer.stop();
  };

  const filteredMarchas = MARCHAS_GRANADINAS.filter(m => {
    const matchGen = selectedGenero === 'Todos' || m.genero === selectedGenero;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term ||
      m.titulo.toLowerCase().includes(term) ||
      m.compositor.toLowerCase().includes(term) ||
      m.dedicadaA.toLowerCase().includes(term) ||
      m.banda.toLowerCase().includes(term) ||
      m.descripcion.toLowerCase().includes(term);

    return matchGen && matchSearch;
  });

  const active = playerState.activeMarcha;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Master Real Recording Player Deck */}
      <div 
        ref={playerDeckRef}
        className="cofrade-card cofrade-ornate-border rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 border-2 border-amber-600/40 relative overflow-hidden"
      >
        {/* Top Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-flame" />
                Gran Sonoteca Procesional
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-cinzel font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Grabaciones Reales de Bandas (100% Auténticas, No IA)</span>
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] gold-gradient-text mt-1">
              Marchas de Semana Santa Interpretadas por Bandas Oficiales
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {playerState.isPlaying && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cinzel font-bold bg-amber-500/20 border border-amber-500/40 text-[var(--accent-gold)] animate-pulse">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Sonando Banda Real</span>
              </span>
            )}
            <span className="text-xs text-[var(--accent-gold)] font-mono tabular-nums bg-[var(--bg-card-subtle)] px-3 py-1 rounded-xl border border-[var(--border-subtle)]">
              {MARCHAS_GRANADINAS.length} grabaciones maestras
            </span>
          </div>
        </div>

        {/* Real Player Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Media Player (YouTube Embedded Stream with real human musicians) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-amber-500/30 shadow-2xl">
              {playerState.isPlaying ? (
                <iframe
                  key={active.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={`Grabación real: ${active.titulo} - ${active.banda}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black via-zinc-950 to-zinc-900"
                  onClick={() => handlePlayRealMarcha(active)}
                >
                  <img
                    src="/src/assets/images/granada_hero_1792744456031.jpg"
                    alt={active.titulo}
                    className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                  <div className="relative z-10 space-y-3 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition duration-300 ring-4 ring-amber-400/30">
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                        Hacer Clic para Reproducir Grabación Real
                      </span>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                        {active.titulo}
                      </h3>
                      <p className="text-xs text-amber-200/90 font-serif-book mt-0.5">
                        {active.banda}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-[11px] text-stone-300">
                      <Music className="w-3 h-3 text-amber-400" />
                      <span>{active.duracion} min · Sonido directo en procesión</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Player Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                {playerState.isPlaying ? (
                  <button
                    onClick={handleStopRealMarcha}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-cinzel font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Detener Reproducción</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlayRealMarcha(active)}
                    className="px-4 py-1.5 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white font-cinzel font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Escuchar en Directo</span>
                  </button>
                )}

                <a
                  href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs flex items-center gap-1.5 transition"
                  title="Abrir en YouTube en Alta Definición"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver en YouTube</span>
                </a>
              </div>

              <div className="text-[11px] text-[var(--text-muted)] font-mono">
                <span>Grabación en vivo: </span>
                <span className="text-[var(--accent-gold)] font-bold">{active.duracion}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Historical & Performance Details */}
          <div className="lg:col-span-5 space-y-3.5">
            
            {/* Real Band Credential Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 via-[var(--bg-card-subtle)] to-[var(--bg-card)] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Banda Intérprete Real
                </span>
                <span className="text-[10px] font-cinzel text-[var(--accent-gold)] px-2 py-0.5 rounded bg-black/30 border border-amber-500/20">
                  {active.genero}
                </span>
              </div>

              <h4 className="font-cinzel text-base font-bold text-[var(--text-primary)] leading-snug">
                {active.banda}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Compositor:</span>
                  <strong className="text-[var(--text-primary)] font-cinzel">{active.compositor}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Año y Ritmo:</span>
                  <span className="text-[var(--accent-gold)] font-mono">{active.año} · {active.ritmo}</span>
                </div>
              </div>
            </div>

            {/* Dedication and Description */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Dedicada a:</span>
                <p className="font-cinzel text-xs font-bold text-[var(--accent-gold)] mt-0.5">
                  {active.dedicadaA}
                </p>
              </div>

              <p className="text-xs text-[var(--text-secondary)] font-serif-book leading-relaxed">
                {active.descripcion}
              </p>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-cinzel font-bold text-[var(--accent-gold)] block text-[11px] mb-1">
                  Momento Cumbre en la Semana Santa de Granada:
                </span>
                <p className="italic text-[var(--text-primary)] font-serif-book text-[11px] leading-snug">
                  "{active.momentoEnGranada}"
                </p>
              </div>
            </div>

            {/* Ask Capataz AI about this march */}
            <button
              onClick={() => onAskCapataz(`Cuéntame la historia completa, detalles del compositor y cuándo se toca la marcha procesional "${active.titulo}" en la Semana Santa de Granada.`)}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-cinzel text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Preguntar historia de esta marcha al Capataz</span>
            </button>

          </div>

        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="editorial-card rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar marcha real por título, compositor o banda..."
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition font-serif-book"
            />
          </div>

          {/* Genre selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {generos.map((gen) => (
              <button
                key={gen}
                onClick={() => setSelectedGenero(gen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-cinzel font-medium whitespace-nowrap transition ${
                  selectedGenero === gen
                    ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {gen}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Marchas Grid Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarchas.map((marcha) => {
          const isSelected = active.id === marcha.id;
          const isCurrentlyPlaying = playerState.isPlaying && isSelected;

          return (
            <div
              key={marcha.id}
              className={`editorial-card cofrade-ornate-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 relative ${
                isSelected
                  ? 'ring-2 ring-amber-500/60 shadow-lg bg-[var(--accent-gold-bg)]/40'
                  : 'hover:border-amber-500/40 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header: Badge & Band */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Grabación Real</span>
                  </span>

                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                    {marcha.duracion} min
                  </span>
                </div>

                {/* Title & Real Band */}
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-gold)] transition">
                    {marcha.titulo}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[var(--accent-gold)] font-medium mt-1">
                    <Music className="w-3 h-3 text-[var(--accent-gold)] shrink-0" />
                    <span className="truncate">{marcha.banda}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)] font-serif-book">
                  <p className="line-clamp-1">
                    <strong className="text-[var(--text-primary)] font-cinzel">Autor:</strong> {marcha.compositor} ({marcha.año})
                  </p>
                  <p className="line-clamp-1">
                    <strong className="text-[var(--text-primary)] font-cinzel">Dedicada:</strong> {marcha.dedicadaA}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 italic pt-1 border-t border-[var(--border-subtle)]">
                    "{marcha.momentoEnGranada}"
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-4 mt-3 border-t border-[var(--border-subtle)] flex items-center gap-2">
                <button
                  onClick={() => handlePlayRealMarcha(marcha)}
                  className={`flex-1 py-2 px-3 rounded-xl font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm ${
                    isCurrentlyPlaying
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400/50 animate-pulse'
                      : 'bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCurrentlyPlaying ? 'Sonando en Directo' : 'Escuchar Banda Real'}</span>
                </button>

                <button
                  onClick={() => onAskCapataz(`Háblame de la marcha "${marcha.titulo}" de ${marcha.compositor}, cuándo se toca y su trascendencia en la Semana Santa de Granada.`)}
                  className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] border border-[var(--border-subtle)] transition"
                  title="Consultar historia con el Capataz"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
