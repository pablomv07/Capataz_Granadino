import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  CalendarDays, 
  MapPin, 
  BookOpen, 
  Award, 
  Bell, 
  Sparkles, 
  Radio, 
  Route, 
  CloudRain, 
  Music, 
  Utensils, 
  Scale,
  Sun,
  Moon,
  Info,
  Flame,
  Square
} from 'lucide-react';
import { cofradeAudio } from '../utils/audio';
import { realCofradePlayer, RealPlayerState } from '../utils/realPlayerState';
import { MARCHAS_GRANADINAS } from '../data/marchas';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  brevityMode?: 'ultra' | 'conciso' | 'detallado';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLluvia: () => void;
  onOpenComparador: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  theme,
  onToggleTheme,
  onOpenLluvia,
  onOpenComparador
}) => {
  const [knocking, setKnocking] = useState(false);
  const [showLlamadorInfo, setShowLlamadorInfo] = useState(false);
  const [playerState, setPlayerState] = useState<RealPlayerState>({
    isPlaying: false,
    activeMarcha: MARCHAS_GRANADINAS[0],
    playerMode: 'video'
  });

  useEffect(() => {
    const unsub = realCofradePlayer.subscribe(setPlayerState);
    return unsub;
  }, []);

  const handleLlamadorClick = () => {
    setKnocking(true);
    cofradeAudio.playLlamador(true);
    setShowLlamadorInfo(true);
    setTimeout(() => setKnocking(false), 450);
    setTimeout(() => setShowLlamadorInfo(false), 3800);
  };

  const navItems = [
    { id: 'asistente', label: 'Capataz IA', icon: MessageSquare },
    { id: 'endirecto', label: 'En Directo', icon: Radio },
    { id: 'hermandades', label: '32 Cofradías', icon: CalendarDays },
    { id: 'miruta', label: 'Mi Ruta', icon: Route },
    { id: 'rincones', label: 'Mapa & Rincones', icon: MapPin },
    { id: 'guia', label: 'Carrera Oficial', icon: BookOpen },
    { id: 'marchas', label: 'Marchas', icon: Music },
    { id: 'gastronomia', label: 'Gastronomía', icon: Utensils },
    { id: 'glosario', label: 'Glosario', icon: Sparkles },
    { id: 'quiz', label: 'Trivia', icon: Award },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            
            {/* Zone 1: Brand Wordmark (Single clean line with noble crest) */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-3">
              <div 
                className="flex items-center gap-3 cursor-pointer group shrink-0"
                onClick={() => setActiveTab('asistente')}
                title="Volver al Capataz IA"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 font-cinzel font-bold text-base flex items-center justify-center shadow-md border border-amber-500/40 transform transition-transform group-hover:scale-105 shrink-0 relative">
                  <span>CG</span>
                  <Flame className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-flame drop-shadow" />
                </div>

                <div>
                  <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[var(--text-primary)] leading-tight whitespace-nowrap block">
                    EL CAPATAZ GRANADINO
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-sans">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500 animate-flame" />
                      <span>Semana Santa de Granada</span>
                    </span>
                    <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
                    <span className="text-[var(--accent-gold)] font-medium">Edición Monumental</span>
                  </div>
                </div>
              </div>

              {/* Live Real March Indicator Pill */}
              {playerState.isPlaying && playerState.activeMarcha && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] shadow-sm animate-pulse-glow shrink-0">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-soundwave-1" />
                    <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-soundwave-2" />
                    <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-soundwave-3" />
                  </div>
                  <button
                    onClick={() => setActiveTab('marchas')}
                    className="text-xs font-cinzel font-bold text-[var(--accent-gold)] hover:underline truncate max-w-[160px]"
                    title={`Ir a la sonoteca: ${playerState.activeMarcha.titulo} (${playerState.activeMarcha.banda})`}
                  >
                    {playerState.activeMarcha.titulo}
                  </button>
                  <button
                    onClick={() => realCofradePlayer.stop()}
                    className="p-1 rounded-full hover:bg-[var(--border-strong)] text-[var(--accent-gold)] transition"
                    title="Detener marcha"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
              )}

              {/* Mobile Quick Controls: Theme + Llamador (Generous 44px touch targets) */}
              <div className="lg:hidden flex items-center gap-2 shrink-0">
                <button
                  onClick={onToggleTheme}
                  title={theme === 'light' ? 'Modo Noche' : 'Modo Luz'}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] active:scale-95 transition"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 text-amber-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  onClick={handleLlamadorClick}
                  title="Tocar el llamador del paso"
                  className={`min-h-[44px] px-3 rounded-xl bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] text-[var(--accent-gold)] text-xs font-cinzel font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
                    knocking ? 'scale-105 ring-2 ring-amber-500' : ''
                  }`}
                >
                  <Bell className={`w-4 h-4 ${knocking ? 'animate-bounce' : ''}`} />
                  <span className="hidden xs:inline">¡Llamador!</span>
                </button>
              </div>
            </div>

            {/* Zone 2: Desktop & Tablet Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none justify-start lg:justify-end">
              <nav className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 ${
                        isActive
                          ? 'bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border border-[var(--border-strong)] font-semibold shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[var(--accent-gold)]' : 'opacity-70'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Zone 3: Desktop Primary Utility Actions */}
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
                {/* Theme Switcher Button */}
                <button
                  onClick={onToggleTheme}
                  title={theme === 'light' ? 'Cambiar a Modo Madrugada (Oscuro)' : 'Cambiar a Modo Albaicín (Luz Archivo)'}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-stone-600" />
                      <span>Noche</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Luz</span>
                    </>
                  )}
                </button>

                {/* Rain Protocol Action */}
                <button
                  onClick={onOpenLluvia}
                  title="Protocolo de lluvia y templos de refugio"
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-xs font-cinzel font-medium flex items-center gap-1.5 transition active:scale-95"
                >
                  <CloudRain className="w-3.5 h-3.5 opacity-70" />
                  <span>¿Lluvia?</span>
                </button>

                {/* Comparador Action */}
                <button
                  onClick={onOpenComparador}
                  title="Comparador cara a cara de cofradías"
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-xs font-cinzel font-medium flex items-center gap-1.5 transition active:scale-95"
                >
                  <Scale className="w-3.5 h-3.5 opacity-70" />
                  <span>Comparar</span>
                </button>

                {/* Llamador Action */}
                <button
                  onClick={handleLlamadorClick}
                  title="Tocar el llamador del paso (martillo con el que el capataz ordena la 'levantá' al grito de ¡A ésta es!)"
                  className={`px-3 py-1.5 rounded-lg bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] text-[var(--accent-gold)] text-xs font-cinzel font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
                    knocking ? 'scale-105 ring-2 ring-amber-500' : ''
                  }`}
                >
                  <Bell className={`w-3.5 h-3.5 ${knocking ? 'animate-bounce' : ''}`} />
                  <span>¡Llamador!</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Educational toast when Llamador is struck */}
      {showLlamadorInfo && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] rounded-2xl p-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-gold)] text-white shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="font-cinzel text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                ¡Golpe de Llamador (Martillo)!
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-snug mt-1 font-serif-book">
                Es la pieza de orfebrería de bronce con la que el capataz golpea el paso para ordenar la <strong>levantá</strong> (<em>"¡A ésta es!"</em> / <em>"¡Al cielo con Ella!"</em>) o mandarlo a tierra.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
