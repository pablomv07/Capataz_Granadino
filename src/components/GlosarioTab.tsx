import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  MessageSquare
} from 'lucide-react';
import { GLOSARIO_GRANADINO } from '../data/glosario';

interface GlosarioTabProps {
  onAskCapataz: (query: string) => void;
}

export const GlosarioTab: React.FC<GlosarioTabProps> = ({ onAskCapataz }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Paso y Cuadrilla', 'Tradición Granadina', 'Cortejo', 'Indumentaria'];

  const filteredGlosario = useMemo(() => {
    return GLOSARIO_GRANADINO.filter(item => {
      const matchCat = selectedCategory === 'Todas' || item.categoria === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || 
        item.termino.toLowerCase().includes(term) ||
        item.definicion.toLowerCase().includes(term) ||
        (item.ejemploGranada && item.ejemploGranada.toLowerCase().includes(term));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header and Filter */}
      <div className="editorial-card rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold block mb-1">
              Vocabulario & Jerga de Paso
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Glosario Cofrade Granadino</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-book">
              Términos esenciales, jerga de capataces y tradiciones genuinas de la Semana Mayor nazarí.
            </p>
          </div>

          <span className="text-xs text-[var(--accent-gold)] font-mono tabular-nums bg-[var(--bg-card-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] shrink-0">
            {filteredGlosario.length} términos
          </span>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-subtle)]">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar término (Tarja, Greñúo, Chías, Chicotá...)..."
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition font-serif-book"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-bold shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Glossary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGlosario.map((item, i) => (
          <div
            key={i}
            className="editorial-card editorial-card-hover rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-cinzel text-[var(--accent-gold)] font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-[var(--border-subtle)]">
                {item.categoria}
              </div>

              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition mb-2">
                {item.termino}
              </h3>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 font-serif-book">
                {item.definicion}
              </p>

              {item.ejemploGranada && (
                <div className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed mb-3 font-serif-book">
                  <strong className="text-[var(--accent-gold)] font-cinzel">En Granada: </strong>
                  <span>{item.ejemploGranada}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onAskCapataz(`¿Cuál es el origen y curiosidad del término '${item.termino}' en la Semana Santa de Granada? Responde conciso.`)}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold)]/10 border border-[var(--border-subtle)] text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Preguntar detalles a la IA</span>
            </button>
          </div>
        ))}
      </div>

      {filteredGlosario.length === 0 && (
        <div className="editorial-card rounded-2xl p-8 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[var(--accent-gold)] opacity-40 mx-auto" />
          <h3 className="font-cinzel text-lg font-bold text-[var(--text-primary)]">Término no encontrado</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto font-serif-book">
            Puedes consultar cualquier palabra directamente a El Capataz en la pestaña del chat y te dará su significado exacto.
          </p>
        </div>
      )}

    </div>
  );
};
