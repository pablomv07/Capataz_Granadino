import React, { useState } from 'react';
import { 
  Utensils, 
  Wine, 
  Coffee, 
  MessageSquare
} from 'lucide-react';
import { PLATOS_CUARESMA, TABERNAS_COFRADES } from '../data/gastronomia';

interface GastronomiaTabProps {
  onAskCapataz: (query: string) => void;
}

export const GastronomiaTab: React.FC<GastronomiaTabProps> = ({ onAskCapataz }) => {
  const [activeSubTab, setActiveSubTab] = useState<'platos' | 'tabernas'>('platos');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold block mb-1">
              Tradición Culinaria & Conventual
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Gastronomía Cofrade & Tabernas de Granada</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-book">
              Sabores tradicionales de Cuaresma, dulces de convento y los mejores rincones de tapeo cofrade.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex bg-[var(--bg-card-subtle)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs shrink-0">
            <button
              onClick={() => setActiveSubTab('platos')}
              className={`px-3 py-1.5 rounded-lg font-cinzel font-medium flex items-center gap-1.5 transition ${
                activeSubTab === 'platos'
                  ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Platos y Dulces</span>
            </button>
            <button
              onClick={() => setActiveSubTab('tabernas')}
              className={`px-3 py-1.5 rounded-lg font-cinzel font-medium flex items-center gap-1.5 transition ${
                activeSubTab === 'tabernas'
                  ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Tabernas y Tapas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content: Platos y Dulces */}
      {activeSubTab === 'platos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATOS_CUARESMA.map((plato, idx) => (
            <div
              key={idx}
              className="editorial-card editorial-card-hover rounded-2xl p-5 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-[11px] font-cinzel text-[var(--accent-gold)] font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-[var(--border-subtle)]">
                  {plato.tipo}
                </div>

                <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-gold)] transition">
                  {plato.nombre}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 font-serif-book">
                  {plato.descripcion}
                </p>

                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed mb-3 space-y-1.5 font-serif-book">
                  <div>
                    <strong className="text-[var(--accent-gold)] font-cinzel font-bold">Tradición: </strong>
                    <span>{plato.origenGranadino}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--accent-gold)] font-cinzel font-bold">Dónde probarlo: </strong>
                    <span>{plato.dondeProbarlo}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAskCapataz(`¿Dónde puedo comer las mejores ${plato.nombre} en Granada durante la Semana Santa y qué historia tienen? Responde conciso.`)}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold)]/10 border border-[var(--border-subtle)] text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Preguntar recomendaciones a la IA</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Content: Tabernas y Tapas */}
      {activeSubTab === 'tabernas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TABERNAS_COFRADES.map((taberna, idx) => (
            <div
              key={idx}
              className="editorial-card editorial-card-hover rounded-2xl p-5 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-[11px] text-[var(--accent-gold)] font-cinzel font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-[var(--border-subtle)]">
                  {taberna.zona}
                </div>

                <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-gold)] transition">
                  {taberna.nombre}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 font-serif-book">
                  {taberna.ambiente}
                </p>

                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed mb-3 space-y-1.5 font-serif-book">
                  <div>
                    <strong className="text-[var(--accent-gold)] font-cinzel font-bold">Especialidad cofrade: </strong>
                    <span>{taberna.especialidad}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--accent-gold)] font-cinzel font-bold">Consejo del Capataz: </strong>
                    <span>{taberna.consejo}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAskCapataz(`¿Qué cofradías pasan cerca de ${taberna.nombre} y cómo organizar una parada para tapear en Semana Santa? Responde conciso.`)}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold)]/10 border border-[var(--border-subtle)] text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Preguntar plan con esta taberna</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
