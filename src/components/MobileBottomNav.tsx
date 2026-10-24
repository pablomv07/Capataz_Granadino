import React, { useState } from 'react';
import { 
  MessageSquare, 
  Radio, 
  CalendarDays, 
  Music, 
  Menu, 
  X, 
  MapPin, 
  Route, 
  BookOpen, 
  Utensils, 
  Sparkles, 
  Award, 
  Scale, 
  CloudRain, 
  Sun, 
  Moon,
  Flame,
  ChevronRight
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLluvia: () => void;
  onOpenComparador: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onOpenLluvia,
  onOpenComparador
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'asistente', label: 'Capataz', icon: MessageSquare },
    { id: 'endirecto', label: 'En Directo', icon: Radio },
    { id: 'hermandades', label: '32 Pasos', icon: CalendarDays },
    { id: 'marchas', label: 'Marchas', icon: Music },
  ];

  const secondaryItems = [
    { id: 'miruta', label: 'Mi Ruta Personal', desc: 'Planifica tus horarios y cortejos', icon: Route },
    { id: 'rincones', label: 'Mapa & Rincones Clave', desc: 'Calles insólitas y puntos con GPS', icon: MapPin },
    { id: 'guia', label: 'Carrera Oficial', desc: 'Horarios oficiales de paso y palcos', icon: BookOpen },
    { id: 'gastronomia', label: 'Gastronomía Cofrade', desc: 'Torrijas, leche frita y bares típicos', icon: Utensils },
    { id: 'glosario', label: 'Glosario Cofrade', desc: 'Términos de capataces y costaleros', icon: Sparkles },
    { id: 'quiz', label: 'Trivia de Granada', desc: 'Pon a prueba tus conocimientos', icon: Award },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Hidden on Desktop lg:) */}
      <nav 
        aria-label="Navegación móvil inferior"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] shadow-2xl transition-colors duration-300"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
                  isActive
                    ? 'text-[var(--accent-gold)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[var(--accent-gold-bg)] scale-110' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel tracking-tight mt-0.5 leading-tight">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-gold)] mt-0.5" />
                )}
              </button>
            );
          })}

          {/* 5th Tab: Menu Drawer Toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
              isMenuOpen
                ? 'text-[var(--accent-gold)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${
              isMenuOpen ? 'bg-[var(--accent-gold-bg)] scale-110' : ''
            }`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-cinzel tracking-tight mt-0.5 leading-tight">
              Más
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Drawer / Sheet for Secondary Sections */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div 
            className="relative z-10 bg-[var(--bg-card)] border-t-2 border-[var(--border-strong)] rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-[var(--border-strong)] opacity-60" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 animate-flame" />
                <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
                  Menú Cofrade Granadino
                </h3>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Utility Actions Row */}
            <div className="p-4 grid grid-cols-3 gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
              <button
                onClick={() => {
                  onToggleTheme();
                }}
                className="min-h-[44px] p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1 active:scale-95 transition"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-stone-700" />
                    <span className="text-[10px] font-cinzel font-semibold text-[var(--text-primary)]">Modo Noche</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-cinzel font-semibold text-[var(--text-primary)]">Modo Luz</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenComparador();
                }}
                className="min-h-[44px] p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1 active:scale-95 transition"
              >
                <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
                <span className="text-[10px] font-cinzel font-semibold text-[var(--text-primary)]">Comparador</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenLluvia();
                }}
                className="min-h-[44px] p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1 active:scale-95 transition"
              >
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span className="text-[10px] font-cinzel font-semibold text-[var(--text-primary)]">¿Lluvia?</span>
              </button>
            </div>

            {/* Navigation List Items */}
            <div className="overflow-y-auto p-4 space-y-2">
              <span className="text-[10px] font-cinzel font-bold text-[var(--accent-gold)] uppercase tracking-wider block px-1 mb-1">
                Todas las Secciones
              </span>

              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full min-h-[52px] p-3 rounded-2xl flex items-center justify-between transition-all active:scale-98 ${
                      isActive
                        ? 'bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] text-[var(--accent-gold)] font-bold'
                        : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-card-subtle)] text-[var(--accent-gold)]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-cinzel text-xs font-bold leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-serif-book leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
