import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  MapPin, 
  Church, 
  Users, 
  Sparkles, 
  Filter, 
  MessageSquare,
  Music,
  Info,
  ChevronRight,
  Star,
  X,
  Share2,
  CalendarDays,
  Check
} from 'lucide-react';
import { HERMANDADES_GRANADA, DIAS_SEMANA_SANTA, Hermandad } from '../data/hermandades';

const HERMANDAD_IMAGES: Record<string, string> = {
  'la-aurora': '/src/assets/images/virgen_aurora_1792744456575.jpg',
  'el-silencio': '/src/assets/images/cristo_silencio_1792744457888.jpg',
  'los-gitanos': '/src/assets/images/gitanos_sacromonte_1792744458542.jpg',
  'campo-principe': '/src/assets/images/cristo_favores_1792744458193.jpg',
  'los-favores': '/src/assets/images/cristo_favores_1792744458193.jpg',
};

interface HermandadesTabProps {
  onAskCapataz: (query: string) => void;
  selectedHermandadId?: string | null;
  onNavigateToMap?: (id: string) => void;
}

export const HermandadesTab: React.FC<HermandadesTabProps> = ({ 
  onAskCapataz,
  selectedHermandadId,
  onNavigateToMap
}) => {
  const [selectedDia, setSelectedDia] = useState<string>('Todos los días');
  const [selectedBarrio, setSelectedBarrio] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [modalHermandad, setModalHermandad] = useState<Hermandad | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('capataz_granada_favs');
        return saved ? JSON.parse(saved) : ['borriquilla', 'el-rescate', 'los-gitanos', 'la-aurora', 'el-silencio', 'los-favores'];
      } catch {
        return ['borriquilla', 'el-rescate', 'los-gitanos', 'la-aurora', 'el-silencio', 'los-favores'];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('capataz_granada_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Open modal if external ID requested
  useEffect(() => {
    if (selectedHermandadId) {
      const target = HERMANDADES_GRANADA.find(h => h.id === selectedHermandadId);
      if (target) {
        setModalHermandad(target);
      }
    }
  }, [selectedHermandadId]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const barrios = useMemo(() => {
    const list = Array.from(new Set(HERMANDADES_GRANADA.map(h => h.barrio)));
    return ['Todos', ...list];
  }, []);

  const filteredHermandades = useMemo(() => {
    return HERMANDADES_GRANADA.filter(h => {
      const matchDia = selectedDia === 'Todos los días' || h.dia === selectedDia;
      const matchBarrio = selectedBarrio === 'Todos' || h.barrio === selectedBarrio;
      const matchFav = !onlyFavorites || favorites.includes(h.id);
      const matchSearch = searchTerm === '' || 
        h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.apodo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.sede.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.titulares.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDia && matchBarrio && matchFav && matchSearch;
    });
  }, [selectedDia, selectedBarrio, onlyFavorites, searchTerm, favorites]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Filter Controls Bar */}
      <div className="editorial-card rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Las 32 Hermandades de Penitencia de Granada</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Horarios oficiales, itinerarios completos, templos de salida y detalles históricos.
            </p>
          </div>

          {/* Quick toggle favorites */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-medium flex items-center gap-1.5 transition-all ${
                onlyFavorites
                  ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm'
                  : 'bg-[var(--bg-app)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--accent-gold)]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white text-white' : 'text-[var(--accent-gold)]'}`} />
              <span>Favoritas ({favorites.length})</span>
            </button>

            <span className="text-xs text-[var(--text-muted)] font-mono tabular-nums px-2.5 py-1">
              {filteredHermandades.length} / 32 cofradías
            </span>
          </div>
        </div>

        {/* Filters and Search row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)]">
          
          {/* Search bar */}
          <div className="relative">
            <label className="text-[11px] font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Buscar Cofradía:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, apodo (Greñúo, Favores...)..."
                className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[var(--accent-gold)] transition shadow-inner font-sans font-medium"
              />
            </div>
          </div>

          {/* Day Filter */}
          <div>
            <label className="text-[11px] font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Día de Salida:
            </label>
            <select
              value={selectedDia}
              onChange={(e) => setSelectedDia(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[var(--accent-gold)] transition cursor-pointer shadow-sm"
            >
              {DIAS_SEMANA_SANTA.map(dia => (
                <option key={dia} value={dia} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1 font-sans">
                  {dia}
                </option>
              ))}
            </select>
          </div>

          {/* Barrio Filter */}
          <div>
            <label className="text-[11px] font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Barrio o Templo:
            </label>
            <select
              value={selectedBarrio}
              onChange={(e) => setSelectedBarrio(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[var(--accent-gold)] transition cursor-pointer shadow-sm"
            >
              {barrios.map(b => (
                <option key={b} value={b} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1 font-sans">
                  {b === 'Todos' ? 'Todos los Barrios' : `Barrio: ${b}`}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Brotherhood Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHermandades.map((h) => {
          const isFav = favorites.includes(h.id);

          return (
            <div
              key={h.id}
              onClick={() => setModalHermandad(h)}
              className="cofrade-card cofrade-card-hover cofrade-ornate-border rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
            >
              {HERMANDAD_IMAGES[h.id] && (
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={HERMANDAD_IMAGES[h.id]}
                    alt={h.nombre}
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[11px] font-cinzel font-bold text-amber-300 border border-white/20 shadow-sm">
                    {h.dia}
                  </span>
                </div>
              )}

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header metadata unboxed: Day · Barrio · Favorite Star */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)] font-cinzel font-bold">
                      <span className="px-2 py-0.5 rounded bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] text-[var(--accent-gold)]">
                        {h.dia}
                      </span>
                      <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
                      <span className="text-[var(--text-secondary)] font-sans font-medium text-[11px]">{h.barrio}</span>
                    </div>
                    
                    <button
                      onClick={(e) => toggleFavorite(h.id, e)}
                      title={isFav ? 'Quitar de favoritas' : 'Añadir a mis favoritas'}
                      className="p-1 rounded-full text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : 'text-[var(--text-muted)] hover:text-amber-500'}`} />
                    </button>
                  </div>

                  {/* Title & Nickname */}
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition leading-snug">
                    {h.nombre}
                  </h3>
                  {h.apodo && (
                    <p className="text-xs text-[var(--accent-gold)] font-medium mb-2 italic">
                      "{h.apodo}"
                    </p>
                  )}

                {/* Sede */}
                <div className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5 mb-3 bg-[var(--bg-card-subtle)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <Church className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{h.sede}</span>
                </div>

                {/* Time grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] mb-3 font-mono tabular-nums">
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Salida</span>
                    <span className="text-[var(--text-primary)] font-bold">{h.salida}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Ganivet (C.O.)</span>
                    <span className="text-[var(--text-primary)] font-bold">{h.carreraOficial}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Catedral</span>
                    <span className="text-[var(--text-primary)] font-bold">{h.catedral}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Regreso</span>
                    <span className="text-[var(--text-primary)] font-bold">{h.regreso}</span>
                  </div>
                </div>

                {/* Curiosidad */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2">
                  <span className="text-[var(--accent-gold)] font-medium">Clave: </span>
                  {h.curiosidad}
                </p>

                {/* Key points unboxed */}
                <div className="text-[11px] text-[var(--text-muted)] mb-2 flex items-center gap-1.5 flex-wrap">
                  <MapPin className="w-3 h-3 text-[var(--accent-gold)] shrink-0" />
                  {h.puntosClave.map((punto, i) => (
                    <React.Fragment key={i}>
                      <span className="text-[var(--text-secondary)]">{punto}</span>
                      {i < h.puntosClave.length - 1 && <span className="text-[var(--border-strong)]">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalHermandad(h);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] text-xs font-cinzel font-medium flex items-center justify-center gap-1 transition"
                >
                  <Info className="w-3 h-3 text-[var(--accent-gold)]" />
                  <span>Ver Itinerario</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskCapataz(`¿Cuáles son los mejores rincones y el horario clave para ver a la cofradía de ${h.nombre}?`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white text-xs font-cinzel font-medium flex items-center gap-1 transition shadow-sm active:scale-95"
                  title="Preguntar a la IA sobre esta cofradía"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Preguntar</span>
                </button>
              </div>

            </div>
          </div>
          );
        })}
      </div>

      {/* Brotherhood Detail Modal */}
      {modalHermandad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="cofrade-card cofrade-ornate-border rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-[var(--text-primary)] space-y-4 max-h-[90vh] overflow-y-auto scrollbar-cofrade border-2 border-[var(--border-strong)]">
            
            {/* Close button */}
            <button
              onClick={() => setModalHermandad(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-stone-300 hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo preview banner if available */}
            {HERMANDAD_IMAGES[modalHermandad.id] && (
              <div className="relative h-44 sm:h-52 -mx-6 -mt-6 mb-3 overflow-hidden rounded-t-3xl">
                <img
                  src={HERMANDAD_IMAGES[modalHermandad.id]}
                  alt={modalHermandad.nombre}
                  className="w-full h-full object-cover object-center filter brightness-[0.85]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140824] via-transparent to-transparent" />
                <span className="absolute bottom-2 left-4 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-cinzel text-amber-300 border border-amber-500/30">
                  Estampa Cofrade Ilustrada
                </span>
              </div>
            )}

            {/* Modal Title & Day */}
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-[var(--accent-gold)] font-semibold mb-1">
                <span>{modalHermandad.dia}</span>
                <span className="text-[var(--border-strong)]">·</span>
                <span className="text-[var(--text-muted)] font-sans font-normal">{modalHermandad.barrio}</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-[var(--text-primary)]">
                {modalHermandad.nombre}
              </h3>
              {modalHermandad.apodo && (
                <p className="text-sm text-[var(--accent-gold)] italic font-cinzel">
                  "{modalHermandad.apodo}"
                </p>
              )}
            </div>

            {/* Modal Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-center font-mono tabular-nums text-xs">
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Salida</span>
                <span className="text-[var(--accent-gold)] font-bold text-sm">{modalHermandad.salida}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Ganivet</span>
                <span className="text-[var(--accent-gold)] font-bold text-sm">{modalHermandad.carreraOficial}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Catedral</span>
                <span className="text-[var(--accent-gold)] font-bold text-sm">{modalHermandad.catedral}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Regreso</span>
                <span className="text-[var(--accent-gold)] font-bold text-sm">{modalHermandad.regreso}</span>
              </div>
            </div>

            {/* Sede y Pasos */}
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Church className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span><strong>Sede Canónica:</strong> {modalHermandad.sede}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span><strong>Pasos e Imaginería:</strong> {modalHermandad.pasos} {modalHermandad.pasos === 1 ? 'paso' : 'pasos'} · {modalHermandad.titulares}</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span><strong>Acompañamiento:</strong> {modalHermandad.musica}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span><strong>Hábito Nazareno:</strong> {modalHermandad.tunica}</span>
              </div>
            </div>

            {/* Puntos Clave */}
            <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <h4 className="font-cinzel text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Rincones Clave para verla:</span>
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                {modalHermandad.puntosClave.join(' · ')}
              </p>
            </div>

            {/* Itinerario Completo */}
            <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <h4 className="font-cinzel text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1.5">
                Itinerario Oficial:
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                {modalHermandad.itinerarioResumido}
              </p>
            </div>

            {/* Curiosidad */}
            <div className="p-3 rounded-xl bg-[var(--accent-gold-bg)] border border-[var(--border-strong)] text-xs text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--accent-gold)] font-cinzel">Tradición y Detalle: </strong>
              {modalHermandad.curiosidad}
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const shareText = `Horario e itinerario de ${modalHermandad.nombre} (${modalHermandad.dia} en Granada):\nSalida: ${modalHermandad.salida} | Carrera Oficial: ${modalHermandad.carreraOficial} | Regreso: ${modalHermandad.regreso}\nSede: ${modalHermandad.sede}\n— Vía El Capataz Granadino`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] text-[var(--accent-gold)] text-xs font-medium flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Ficha'}</span>
              </button>

              {onNavigateToMap && (
                <button
                  onClick={() => {
                    const id = modalHermandad.id;
                    setModalHermandad(null);
                    onNavigateToMap(id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-[var(--accent-gold)] text-[var(--accent-gold)] text-xs font-cinzel font-bold flex items-center gap-1.5 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver en Mapa</span>
                </button>
              )}

              <button
                onClick={() => {
                  const query = `¿Cuáles son los mejores secretos, recomendaciones y calles para ver a ${modalHermandad.nombre} el ${modalHermandad.dia}?`;
                  setModalHermandad(null);
                  onAskCapataz(query);
                }}
                className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white text-xs font-cinzel font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consultar con El Capataz IA</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
