import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  ArrowRight,
  Flame,
  Music
} from 'lucide-react';

interface HeroBannerProps {
  onAskCapataz: (query: string) => void;
  onSelectHermandad: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onAskCapataz,
  onSelectHermandad,
  onNavigateTab
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const featuredMoments = [
    {
      id: 'la-aurora',
      fig: 'Fig. 01',
      title: 'La Aurora Coronada',
      subtitle: 'La Noche Blanca del Albayzín',
      dia: 'Jueves Santo',
      lugar: 'San Miguel Bajo y Cuesta de San Gregorio',
      image: '/src/assets/images/virgen_aurora_1792744456575.jpg',
      prompt: '¿Por dónde y a qué horas ver a La Aurora en el Albayzín el Jueves Santo?'
    },
    {
      id: 'el-silencio',
      fig: 'Fig. 02',
      title: 'Cristo del Silencio',
      subtitle: 'Tinieblas en la Carrera del Darro',
      dia: 'Jueves Santo (Madrugada)',
      lugar: 'Carrera del Darro a oscuras',
      image: '/src/assets/images/cristo_silencio_1792744457888.jpg',
      prompt: '¿Cómo es el paso de El Silencio por la Carrera del Darro a oscuras?'
    },
    {
      id: 'los-gitanos',
      fig: 'Fig. 03',
      title: 'Cristo de los Gitanos',
      subtitle: 'Hogueras y Saetas en el Sacromonte',
      dia: 'Miércoles Santo',
      lugar: 'Camino del Sacromonte y Abadía',
      image: '/src/assets/images/gitanos_sacromonte_1792744458542.jpg',
      prompt: '¿Cuál es la hora y mejores sitios para ver el regreso de Los Gitanos al Sacromonte?'
    },
    {
      id: 'campo-principe',
      fig: 'Fig. 04',
      title: 'Cristo de los Favores',
      subtitle: 'Las 3 de la Tarde en el Realejo',
      dia: 'Viernes Santo',
      lugar: 'Campo del Príncipe',
      image: '/src/assets/images/cristo_favores_1792744458193.jpg',
      prompt: '¿Qué es la tradición de los 3 favores a las 3 de la tarde en el Campo del Príncipe?'
    }
  ];

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden border-2 border-[var(--border-strong)] shadow-lg bg-[var(--bg-card)] transition-colors duration-300 cofrade-ornate-border">
      
      {/* Background Hero Image with atmospheric gradients */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
        <img
          src="/src/assets/images/granada_hero_1792744456031.jpg"
          alt="Semana Santa de Granada con la Alhambra y Carrera del Darro"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transform hover:scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep layered gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />

        {/* Hero Overlay Text */}
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between z-10 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 border border-amber-500/50 backdrop-blur-md text-[11px] font-cinzel font-semibold tracking-wider text-amber-300 shadow-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-flame" />
              <span>Granada · Archivo y Crónica Monumental</span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 text-stone-200 text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition"
              title={isExpanded ? 'Contraer estampas cofrades' : 'Ver estampas cofrades'}
            >
              <span className="hidden sm:inline">{isExpanded ? 'Ocultar Estampas' : 'Ver Estampas'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="max-w-2xl space-y-1.5 sm:space-y-2">
            <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-bold tracking-wide text-stone-50 drop-shadow-md">
              La Guía Monumental de la Semana Santa de Granada
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none font-serif-book">
              32 hermandades de penitencia, cronología por Carrera Oficial, rincones insólitos del Albayzín y Sacromonte, marchas procesionales y la maestría del Capataz IA.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
              <button
                onClick={() => onNavigateTab('marchas')}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/40 via-amber-700/50 to-amber-900/60 hover:from-amber-600/60 hover:to-amber-800/80 border border-amber-400/60 text-amber-200 text-xs font-cinzel font-bold flex items-center gap-1.5 backdrop-blur-sm transition active:scale-95 shadow-md ring-1 ring-amber-400/30"
              >
                <Music className="w-3.5 h-3.5 text-amber-300" />
                <span>Escuchar Marchas</span>
              </button>

              <button
                onClick={() => onNavigateTab('endirecto')}
                className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-200 text-xs font-cinzel font-medium flex items-center gap-1.5 backdrop-blur-sm transition active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>En Directo</span>
              </button>

              <button
                onClick={() => onNavigateTab('hermandades')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-stone-100 text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm transition active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>32 Cofradías</span>
              </button>

              <button
                onClick={() => onNavigateTab('rincones')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-stone-100 text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm transition active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Rincones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cofrade Moments Gallery (Collapsible) */}
      {isExpanded && (
        <div className="p-3 sm:p-5 bg-[var(--bg-card)] border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
              <span>Estampas Cumbre de la Pasión Granadina</span>
            </span>
            <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
              Selecciona una estampa para abrir su itinerario o consultar al Capataz
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredMoments.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono tracking-wider font-semibold text-amber-300 border border-white/15">
                    {item.fig}
                  </span>

                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-cinzel font-bold text-amber-200 border border-white/20 shadow-sm">
                    {item.dia}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-[var(--bg-card)]">
                  <div>
                    <h3 className="font-cinzel text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[var(--accent-gold)] font-medium line-clamp-1">
                      {item.subtitle}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
                      <span>{item.lugar}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-1.5 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => onSelectHermandad(item.id)}
                      className="flex-1 py-1 px-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] text-[11px] font-cinzel font-medium text-center transition"
                    >
                      Ver Ficha
                    </button>
                    <button
                      onClick={() => onAskCapataz(item.prompt)}
                      className="p-1 px-2.5 rounded-lg bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                      title="Preguntar detalles al Capataz"
                    >
                      <span>Consultar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
