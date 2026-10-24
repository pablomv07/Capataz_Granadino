import React from 'react';
import { 
  MapPin, 
  Compass, 
  Sparkles, 
  AlertCircle, 
  Flame, 
  Moon, 
  Sun, 
  Utensils, 
  Clock, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface GuiaTabProps {
  onAskCapataz: (query: string) => void;
}

export const GuiaTab: React.FC<GuiaTabProps> = ({ onAskCapataz }) => {
  const tramosCarreraOficial = [
    {
      num: 1,
      titulo: 'Calle Ángel Ganivet',
      subtitulo: 'Inicio de Carrera Oficial y Palco de Horas',
      desc: 'Donde todas las hermandades presentan su venia al Cabildo de la Federación. Gradas oficiales y sillas.',
    },
    {
      num: 2,
      titulo: 'Mesones y Marqués de Gerona',
      subtitulo: 'Paso por el corazón comercial',
      desc: 'Calles peatonales estrechas donde los pasos andan acompasados muy cerca del público.',
    },
    {
      num: 3,
      titulo: 'Placeta de las Pasiegas',
      subtitulo: 'La estampa cumbre de la Catedral',
      desc: 'El paso gira ante la colosal fachada barroca de Alonso Cano antes de ingresar al templo metropolitano.',
    },
    {
      num: 4,
      titulo: 'Santa Iglesia Catedral',
      subtitulo: 'Estación de penitencia interior',
      desc: 'Oración solemne de las hermandades bajo las sublimes bóvedas renacentistas de Diego de Siloé.',
    },
    {
      num: 5,
      titulo: 'Puerta del Perdón y Cárcel Baja',
      subtitulo: 'Salida de Carrera Oficial',
      desc: 'Concluye el tramo obligatorio y cada cofradía inicia su itinerario de regreso a su templo o barrio.',
    },
  ];

  const barrios = [
    {
      nombre: 'El Albayzín y El Darro',
      icon: Moon,
      image: '/src/assets/images/virgen_aurora_1792744456575.jpg',
      hermandades: 'La Aurora, La Estrella, La Concepción, El Silencio, Vía Crucis, Maravillas',
      puntos: 'Cuesta de San Gregorio, Grifos de San José, San Miguel Bajo, Carrera del Darro.',
      destacado: 'El Jueves Santo es conocido como "la noche blanca del Albayzín", con las cofradías bajando cuestas imposibles.',
    },
    {
      nombre: 'El Sacromonte',
      icon: Flame,
      image: '/src/assets/images/gitanos_sacromonte_1792744458542.jpg',
      hermandades: 'Los Gitanos (Cristo del Consuelo y Virgen del Sacromonte)',
      puntos: 'Cuesta del Chapiz, Camino del Sacromonte, Abadía entre cuevas.',
      destacado: 'Miércoles Santo de madrugada: se prenden fogatas de romero y resuenan las saetas gitanas al paso de la comitiva.',
    },
    {
      nombre: 'El Realejo',
      icon: Sun,
      image: '/src/assets/images/cristo_favores_1792744458193.jpg',
      hermandades: 'Santa Cena, Rosario, La Cañilla, Favores, El Huerto, El Facundillo',
      puntos: 'Plaza de Santo Domingo, Campo del Príncipe, Cuesta de San Cecilio.',
      destacado: 'El rezo de las tres de la tarde el Viernes Santo en el Campo del Príncipe congrega a toda la ciudad.',
    },
    {
      nombre: 'La Alhambra',
      icon: Sparkles,
      image: '/src/assets/images/granada_hero_1792744456031.jpg',
      hermandades: 'Santa María de la Alhambra (Sábado Santo)',
      puntos: 'Puerta de la Justicia, Bosque de la Alhambra, Cuesta de Gomérez.',
      destacado: 'El paso de plata reproduce el Patio de los Leones y desciende entre los cipreses centenarios de la fortaleza.',
    },
  ];

  const consejos = [
    {
      titulo: 'Calzado y empedrado granadino',
      desc: 'Las calles del Albayzín y Sacromonte tienen el típico empedrado granadino y pendientes empinadas. Lleva calzado antideslizante con suela de goma.',
    },
    {
      titulo: 'Planifica los cruces con tiempo',
      desc: 'El paso por el Darro y San Gregorio suele cerrarse por aforo 1 o 2 horas antes del paso del cortejo. Anticípate.',
    },
    {
      titulo: 'Silencio en cofradías de luto',
      desc: 'Cofradías como San Agustín, El Silencio o el Santo Entierro exigen máximo recogimiento sin aplausos.',
    },
    {
      titulo: 'Gastronomía de Cuaresma',
      desc: 'No dejes de probar los roscos de Semana Santa, las torrijas con miel de la Alpujarra, y el potaje de vigilia con bacalao.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Introduction banner */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-[var(--accent-gold)]" />
          <span>Guía de Visita y Carrera Oficial</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl font-sans">
          Granada ofrece una Semana Santa única en el mundo: la fusión de la imaginería barroca andaluza con escenarios monumentales incomparables como la <strong>Alhambra</strong>, el <strong>Albayzín</strong>, el río <strong>Darro</strong> y las cuevas del <strong>Sacromonte</strong>.
        </p>
      </div>

      {/* Carrera Oficial Detailed Steps */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[var(--accent-gold)] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Itinerario de la Carrera Oficial</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Recorrido obligatorio para las 32 hermandades federadas
            </p>
          </div>
          <button
            onClick={() => onAskCapataz('¿Cuáles son los mejores sitios para ver la Carrera Oficial de Granada sin tener silla?')}
            className="text-xs px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] font-cinzel font-medium border border-[var(--border-subtle)] transition flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Consultar sitios libres</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {tramosCarreraOficial.map((tramo) => (
            <div
              key={tramo.num}
              className="bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl p-3.5 flex flex-col justify-between group hover:border-[var(--border-strong)] transition"
            >
              <div>
                <span className="w-6 h-6 rounded-lg bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] font-cinzel font-bold text-xs flex items-center justify-center border border-[var(--border-subtle)] mb-2">
                  {tramo.num}
                </span>
                <h4 className="font-cinzel text-sm font-bold text-[var(--text-primary)] mb-1">
                  {tramo.titulo}
                </h4>
                <p className="text-[11px] text-[var(--accent-gold)] font-medium mb-1.5">
                  {tramo.subtitulo}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {tramo.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barrios y Puntos Mágicos */}
      <div className="space-y-4">
        <h3 className="font-cinzel text-lg font-bold text-[var(--accent-gold)] flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>Barrios y Escenarios Singulares de Granada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {barrios.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="editorial-card editorial-card-hover rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {b.image && (
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.nombre}
                      className="w-full h-full object-cover object-center filter brightness-95 hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-cinzel text-amber-300 border border-white/20">
                      Rincón Cofrade
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[var(--border-subtle)]">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent-gold-bg)] flex items-center justify-center text-[var(--accent-gold)] border border-[var(--border-subtle)]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
                        {b.nombre}
                      </h4>
                    </div>

                    <p className="text-xs text-[var(--accent-gold)] font-medium mb-2 font-sans">
                      <span className="text-[var(--text-muted)] font-normal">Cofradías: </span>
                      {b.hermandades}
                    </p>

                    <p className="text-xs text-[var(--text-secondary)] mb-2.5 leading-relaxed font-sans">
                      <strong className="text-[var(--accent-gold)] font-cinzel">Puntos cumbre: </strong>
                      {b.puntos}
                    </p>

                    <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed mb-3 font-sans">
                      {b.destacado}
                    </div>
                  </div>

                  <button
                    onClick={() => onAskCapataz(`¿Qué momentos imperdibles recomiendas vivir en ${b.nombre} de forma concisa?`)}
                    className="w-full py-2 px-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] text-[var(--accent-gold)] text-xs font-cinzel font-medium flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Preguntar al Capataz sobre este barrio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Tips */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-cinzel text-lg font-bold text-[var(--accent-gold)] flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Recomendaciones Rápidas del Capataz</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {consejos.map((c, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-1.5"
            >
              <h4 className="font-cinzel text-xs font-bold text-amber-300">
                {c.titulo}
              </h4>
              <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
