import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatTab } from './components/ChatTab';
import { MiRutaTab } from './components/MiRutaTab';
import { EnDirectoTab } from './components/EnDirectoTab';
import { MapaRinconesTab } from './components/MapaRinconesTab';
import { HermandadesTab } from './components/HermandadesTab';
import { MarchasTab } from './components/MarchasTab';
import { GastronomiaTab } from './components/GastronomiaTab';
import { GuiaTab } from './components/GuiaTab';
import { GlosarioTab } from './components/GlosarioTab';
import { QuizTab } from './components/QuizTab';
import { ProtocoloLluviaModal } from './components/ProtocoloLluviaModal';
import { ComparadorModal } from './components/ComparadorModal';
import { HeroBanner } from './components/HeroBanner';
import { WeatherWidget } from './components/WeatherWidget';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('asistente');
  const [brevityMode, setBrevityMode] = useState<'ultra' | 'conciso' | 'detallado'>('conciso');
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);
  const [selectedHermandadId, setSelectedHermandadId] = useState<string | null>(null);
  const [isLluviaOpen, setIsLluviaOpen] = useState<boolean>(false);
  const [isComparadorOpen, setIsComparadorOpen] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Client-side Quota Defense (Demo Key)
  React.useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Theme state: 'light' (Albaicín / Piedra Monumental) or 'dark' (Madrugada de Candelas)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('capataz_theme');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch {
        // fallback
      }
    }
    return 'light';
  });

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('capataz_theme', theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAskCapataz = (query: string) => {
    setPendingPrompt(query);
    setActiveTab('asistente');
  };

  const handleSelectHermandad = (id: string) => {
    setSelectedHermandadId(id);
    setActiveTab('hermandades');
  };

  const handleViewOnMap = (id: string) => {
    setSelectedHermandadId(id);
    setActiveTab('rincones');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-600 selection:text-white transition-colors duration-300">
      
      {/* Client-side Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPendingPrompt(undefined);
        }}
        brevityMode={brevityMode}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenLluvia={() => setIsLluviaOpen(true)}
        onOpenComparador={() => setIsComparadorOpen(true)}
      />

      {/* Rain Protocol & Shelters Modal */}
      <ProtocoloLluviaModal
        isOpen={isLluviaOpen}
        onClose={() => setIsLluviaOpen(false)}
        onAskCapataz={handleAskCapataz}
      />

      {/* Cofradías Side-by-Side Comparer Modal */}
      <ComparadorModal
        isOpen={isComparadorOpen}
        onClose={() => setIsComparadorOpen(false)}
        onAskCapataz={handleAskCapataz}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 lg:pb-8">
        
        {/* Top Meteorological Status & Semana Santa Forecast Widget */}
        <WeatherWidget
          onAskCapataz={handleAskCapataz}
          onOpenLluviaProtocol={() => setIsLluviaOpen(true)}
        />

        {/* Visual Hero Showcase Banner */}
        <HeroBanner
          onAskCapataz={handleAskCapataz}
          onSelectHermandad={handleSelectHermandad}
          onNavigateTab={setActiveTab}
        />

        {activeTab === 'asistente' && (
          <ChatTab
            brevityMode={brevityMode}
            setBrevityMode={setBrevityMode}
            initialPrompt={pendingPrompt}
            onSelectHermandad={handleSelectHermandad}
          />
        )}

        {activeTab === 'miruta' && (
          <MiRutaTab onAskCapataz={handleAskCapataz} />
        )}

        {activeTab === 'endirecto' && (
          <EnDirectoTab
            onAskCapataz={handleAskCapataz}
            onSelectHermandad={handleSelectHermandad}
          />
        )}

        {activeTab === 'rincones' && (
          <MapaRinconesTab
            onAskCapataz={handleAskCapataz}
            selectedHermandadId={selectedHermandadId}
            onSelectHermandad={setSelectedHermandadId}
          />
        )}

        {activeTab === 'hermandades' && (
          <HermandadesTab
            onAskCapataz={handleAskCapataz}
            selectedHermandadId={selectedHermandadId}
            onNavigateToMap={handleViewOnMap}
          />
        )}

        {activeTab === 'marchas' && (
          <MarchasTab onAskCapataz={handleAskCapataz} />
        )}

        {activeTab === 'gastronomia' && (
          <GastronomiaTab onAskCapataz={handleAskCapataz} />
        )}

        {activeTab === 'guia' && (
          <GuiaTab onAskCapataz={handleAskCapataz} />
        )}

        {activeTab === 'glosario' && (
          <GlosarioTab onAskCapataz={handleAskCapataz} />
        )}

        {activeTab === 'quiz' && (
          <QuizTab onAskCapataz={handleAskCapataz} />
        )}
      </main>

      {/* Footer (hidden or with safe margin above mobile bottom nav) */}
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border-subtle)] py-4 px-4 text-center text-xs text-[var(--text-muted)] transition-colors duration-300 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-semibold text-[var(--accent-gold)]">El Capataz Granadino</span>
            <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
            <span className="text-[var(--text-secondary)]">Semana Santa de Granada</span>
          </div>

          <p className="text-[11px] text-[var(--text-muted)]">
            32 Cofradías de Penitencia · Albayzín, Sacromonte, Realejo y Carrera Oficial
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPendingPrompt(undefined);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenLluvia={() => setIsLluviaOpen(true)}
        onOpenComparador={() => setIsComparadorOpen(true)}
      />

    </div>
  );
}
