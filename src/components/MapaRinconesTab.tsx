import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  MessageSquare,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { PUNTOS_CLAVE_GRANADA } from '../data/puntosMapa';
import { CofradeInteractiveMap } from './CofradeInteractiveMap';

interface MapaRinconesTabProps {
  onAskCapataz: (query: string) => void;
  selectedHermandadId?: string | null;
  onSelectHermandad?: (id: string) => void;
}

export const MapaRinconesTab: React.FC<MapaRinconesTabProps> = ({ 
  onAskCapataz,
  selectedHermandadId,
  onSelectHermandad
}) => {
  const [selectedBarrio, setSelectedBarrio] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const barrios = ['Todos', 'Albaicín', 'Sacromonte', 'Realejo', 'Centro', 'Alhambra'];

  const filteredPuntos = useMemo(() => {
    return PUNTOS_CLAVE_GRANADA.filter(p => {
      const matchBarrio = selectedBarrio === 'Todos' || p.barrio === selectedBarrio;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        p.cofradias.some(c => c.toLowerCase().includes(term)) ||
        p.consejoCapataz.toLowerCase().includes(term);

      return matchBarrio && matchSearch;
    });
  }, [selectedBarrio, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Interactive Google Map with brotherhood itinerary & key points */}
      <CofradeInteractiveMap
        onAskCapataz={onAskCapataz}
        initialHermandadId={selectedHermandadId}
        onSelectHermandad={onSelectHermandad}
      />

      {/* Editorial Catalog of Granada's Iconic Corners */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold block mb-1">
              Guía de Puntos Clave & Rincones con Encanto
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Rincones Emblemáticos de la Ciudad</span>
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-book">
              Niveles de aforo, dificultades de acceso y recomendaciones del capataz para situarte en los mejores lugares de Granada.
            </p>
          </div>

          <span className="text-xs text-[var(--accent-gold)] font-mono tabular-nums bg-[var(--bg-card-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] shrink-0">
            {filteredPuntos.length} rincones catalogados
          </span>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar rincón (San Gregorio, Darro, Chapiz, Favores...)..."
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition font-serif-book"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {barrios.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBarrio(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel whitespace-nowrap transition ${
                  selectedBarrio === b
                    ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-bold shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Key Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPuntos.map((p) => {
          return (
            <div
              key={p.id}
              className="editorial-card editorial-card-hover rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)] text-xs">
                  <span className="font-cinzel text-[var(--accent-gold)] font-bold uppercase tracking-wider text-[11px]">
                    {p.barrio}
                  </span>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                    p.dificultadAcceso.includes('Muy Alta') 
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                      : p.dificultadAcceso === 'Media'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                    Aforo: {p.dificultadAcceso}
                  </span>
                </div>

                <h4 className="font-cinzel text-base font-bold text-[var(--text-primary)] mb-1">
                  {p.nombre}
                </h4>

                <p className="text-xs text-[var(--text-secondary)] font-serif-book leading-relaxed mb-3">
                  {p.descripcion}
                </p>

                {/* Cofradías que pasan */}
                <div className="mb-3 bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-cinzel uppercase font-bold text-[var(--accent-gold)] block mb-1">
                    Cofradías de paso destacado:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.cofradias.map((c, i) => (
                      <span key={i} className="text-[11px] font-serif-book text-[var(--text-primary)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Momentos estrella */}
                {p.momentosEstrella && p.momentosEstrella.length > 0 && (
                  <div className="mb-3 space-y-1">
                    <span className="text-[10px] font-cinzel uppercase font-semibold text-[var(--text-muted)] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[var(--accent-gold)]" />
                      Momentos inolvidables:
                    </span>
                    <ul className="text-xs text-[var(--text-secondary)] font-serif-book space-y-1 pl-3 border-l-2 border-[var(--accent-gold)]/40">
                      {p.momentosEstrella.map((m, idx) => (
                        <li key={idx} className="leading-snug">{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Consejo Capataz */}
                <div className="mt-2 text-xs font-serif-book italic text-[var(--accent-gold)] bg-amber-500/5 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                  <strong className="not-italic font-cinzel text-[10px] font-bold uppercase text-[var(--text-primary)] block mb-0.5">
                    Consejo del Capataz:
                  </strong>
                  "{p.consejoCapataz}"
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end">
                <button
                  onClick={() => onAskCapataz(`¿Cómo llegar, a qué hora situarme y qué recomendaciones tienes para ver la Semana Santa en ${p.nombre}?`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-semibold text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--accent-gold-contrast)] transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consultar detalles al Capataz</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
