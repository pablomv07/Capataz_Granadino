import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  Users, 
  Camera, 
  Zap, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare,
  ArrowRight,
  Route
} from 'lucide-react';
import { DIAS_SEMANA_SANTA } from '../data/hermandades';

interface MiRutaTabProps {
  onAskCapataz: (query: string) => void;
}

export const MiRutaTab: React.FC<MiRutaTabProps> = ({ onAskCapataz }) => {
  const [selectedDia, setSelectedDia] = useState<string>('Jueves Santo');
  const [perfil, setPerfil] = useState<'agil' | 'familia' | 'foto'>('agil');
  const [franja, setFranja] = useState<'tarde' | 'noche' | 'completo'>('completo');
  const [copied, setCopied] = useState(false);

  // Pre-calculated best routes based on day and profile
  const getRuta = () => {
    if (selectedDia === 'Jueves Santo') {
      if (perfil === 'agil') {
        return [
          { hora: '17:30', lugar: 'Plaza de San Miguel Bajo (Albaicín)', hermandad: 'La Aurora', desc: 'Emocionante salida entre el fervor de los vecinos del barrio.', caminar: '15 min a pie hacia el centro' },
          { hora: '19:45', lugar: 'Calle Ángel Ganivet', hermandad: 'Los Salesianos', desc: 'Paso por la Tribuna Oficial con marchas clásicas acompasadas.', caminar: '10 min hacia Plaza Nueva' },
          { hora: '21:30', lugar: 'Plaza de San Cristóbal / Alhacaba', hermandad: 'La Estrella', desc: 'El palio azul de la Estrella con Sierra Nevada al fondo.', caminar: '15 min bajando hacia el Darro' },
          { hora: '00:00', lugar: 'Carrera del Darro (a oscuras)', hermandad: 'El Silencio', desc: 'Luces apagadas, el rumor del río Darro y el tambor ronco.', caminar: '10 min subiendo hacia San Gregorio' },
          { hora: '01:15', lugar: 'Cuesta de San Gregorio y Grifos de San José', hermandad: 'La Aurora (Recogida)', desc: 'La mítica subida milimétrica de madrugada. Clímax del Jueves Santo.', caminar: 'Fin de recorrido' },
        ];
      }
      if (perfil === 'familia') {
        return [
          { hora: '18:00', lugar: 'Paseo del Violón / Puente Romano', hermandad: 'Los Salesianos', desc: 'Zona amplia y llana, perfecta para ver el cortejo sin agobios.', caminar: '15 min hacia Puerta Real' },
          { hora: '20:15', lugar: 'Plaza del Carmen / Reyes Católicos', hermandad: 'La Aurora', desc: 'Ver el palio con espacio suficiente para carritos y niños.', caminar: '10 min hacia Pasiegas' },
          { hora: '21:45', lugar: 'Plaza de las Pasiegas (Catedral)', hermandad: 'La Estrella', desc: 'Impresionante iluminación de la Catedral y levantás al cielo.', caminar: 'Fin de recorrido recomendado para niños' },
        ];
      }
      return [
        { hora: '18:00', lugar: 'Mirador de San Cristóbal', hermandad: 'La Estrella', desc: 'Fotografía emblemática con la Alhambra y la vega de fondo.', caminar: '20 min hacia San Miguel' },
        { hora: '20:30', lugar: 'Plaza de las Pasiegas', hermandad: 'La Aurora', desc: 'Encuadre majestuoso frente a la fachada barroca de Alonso Cano.', caminar: '15 min hacia el Darro' },
        { hora: '00:00', lugar: 'Puente del Cadí / Carrera del Darro', hermandad: 'El Silencio', desc: 'Silueta del Cristo de la Misericordia con la Alhambra iluminada detrás.', caminar: 'Fin de sesión fotográfica' },
      ];
    }

    if (selectedDia === 'Miércoles Santo') {
      if (perfil === 'agil') {
        return [
          { hora: '16:45', lugar: 'Abadía del Sacromonte', hermandad: 'Los Gitanos (Salida)', desc: 'Salida monumental en el monte con vistas a toda Granada.', caminar: '25 min hacia San Justo' },
          { hora: '18:30', lugar: 'Plaza de la Universidad', hermandad: 'Los Estudiantes', desc: 'Ambiente universitario solemne y calles céntricas.', caminar: '10 min hacia San Matías' },
          { hora: '20:00', lugar: 'Calle San Matías', hermandad: 'Las Penas', desc: 'Salida y paso estrechísimo con olor a clavel rojo y cera morada.', caminar: '15 min hacia Ganivet' },
          { hora: '22:00', lugar: 'Plaza de Santo Domingo', hermandad: 'El Rosario', desc: 'El portentoso andar de las Tres Caídas por el Realejo.', caminar: '25 min subiendo al Chapiz' },
          { hora: '01:00', lugar: 'Cuesta del Chapiz y Camino del Sacromonte', hermandad: 'Los Gitanos (Regreso)', desc: 'Hogueras de romero, saetas desde las cuevas y fervor gitano.', caminar: 'Fin de recorrido' },
        ];
      }
      return [
        { hora: '17:30', lugar: 'Plaza de la Universidad', hermandad: 'Los Estudiantes', desc: 'Espacio despejado con sombra para familias.', caminar: '15 min hacia Gran Vía' },
        { hora: '19:30', lugar: 'Gran Vía / Puerta Real', hermandad: 'Los Gitanos', desc: 'Paso majestuoso del Cristo del Consuelo con su banda.', caminar: '10 min hacia Santo Domingo' },
        { hora: '21:30', lugar: 'Plaza de Santo Domingo (Realejo)', hermandad: 'El Rosario', desc: 'Ambiente festivo cofrade y terrazas para cenar.', caminar: 'Fin de jornada' },
      ];
    }

    if (selectedDia === 'Viernes Santo') {
      return [
        { hora: '14:45', lugar: 'Campo del Príncipe (Realejo)', hermandad: 'Soledad y Favores', desc: 'El rezo de las tres de la tarde. Guardar absoluto silencio a las 15:00 h.', caminar: '15 min hacia el centro' },
        { hora: '18:00', lugar: 'Puente Romano sobre el río Genil', hermandad: 'Los Escolapios', desc: 'Cruce del río Genil con el sol cayendo sobre las aguas.', caminar: '20 min hacia San Jerónimo' },
        { hora: '19:30', lugar: 'Calle San Jerónimo', hermandad: 'Soledad de San Jerónimo', desc: 'Las Chías tocando las trompetas de hojalata y figuras bíblicas.', caminar: '15 min hacia Cuesta de San Cecilio' },
        { hora: '22:30', lugar: 'Cuesta de San Cecilio', hermandad: 'Los Favores (Subida)', desc: 'Vertiginosa subida por la cuesta del Realejo hasta su templo.', caminar: 'Fin de recorrido' },
      ];
    }

    // Default route for other days
    return [
      { hora: '17:30', lugar: 'Calles del barrio de salida', hermandad: 'Cofradía de inicio', desc: 'Disfrutar del cortejo saliendo de su sede canónica.', caminar: '15 min hacia Carrera Oficial' },
      { hora: '19:45', lugar: 'Calle Ángel Ganivet', hermandad: 'Tribuna Oficial', desc: 'Contemplar el paso con marchas de palio y cornetas.', caminar: '10 min hacia la Catedral' },
      { hora: '21:15', lugar: 'Plaza de las Pasiegas', hermandad: 'Estación de Penitencia', desc: 'Giro monumental ante la gran fachada barroca catedralicia.', caminar: '15 min hacia el barrio' },
      { hora: '23:30', lugar: 'Calles de regreso a oscuras', hermandad: 'Recogida solemne', desc: 'Las últimas chicotás antes de arriar el paso en el templo.', caminar: 'Fin de jornada' },
    ];
  };

  const rutaActual = getRuta();

  const handleCopyRuta = () => {
    const text = `🧭 MI RUTA COFRADE IDEAL - ${selectedDia} (Granada)\n\n` +
      rutaActual.map(r => `• ${r.hora} h | ${r.lugar}\n  ${r.hermandad}: ${r.desc}`).join('\n\n') +
      '\n\nGenerado con El Capataz Granadino';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `🧭 MI RUTA COFRADE IDEAL - ${selectedDia} (Granada)\n\n` +
      rutaActual.map(r => `• *${r.hora} h* | ${r.lugar}\n  ${r.hermandad}: ${r.desc}`).join('\n\n') +
      '\n\nGenerado con El Capataz Granadino';
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Mi Ruta Cofrade Ideal</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Generador de itinerarios optimizados por tiempo, aforo y perfil de visita en Granada.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRuta}
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] text-xs font-cinzel font-medium flex items-center gap-1.5 transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiada' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-cinzel font-medium flex items-center gap-1.5 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-amber-500/15">
          
          {/* Day selection */}
          <div>
            <label className="text-[11px] font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Selecciona el Día de tu Ruta:
            </label>
            <select
              value={selectedDia}
              onChange={(e) => setSelectedDia(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[var(--accent-gold)] transition cursor-pointer shadow-sm"
            >
              {DIAS_SEMANA_SANTA.filter(d => d !== 'Todos los días').map(d => (
                <option key={d} value={d} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1 font-sans">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Profile selection */}
          <div>
            <label className="text-[11px] font-cinzel font-semibold text-[var(--accent-gold)] block mb-1">
              Perfil de Visita:
            </label>
            <div className="flex bg-[var(--bg-app)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs">
              <button
                onClick={() => setPerfil('agil')}
                className={`flex-1 py-1.5 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1 transition ${
                  perfil === 'agil' ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Ágil & Cuestas</span>
              </button>
              <button
                onClick={() => setPerfil('familia')}
                className={`flex-1 py-1.5 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1 transition ${
                  perfil === 'familia' ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Familiar</span>
              </button>
              <button
                onClick={() => setPerfil('foto')}
                className={`flex-1 py-1.5 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1 transition ${
                  perfil === 'foto' ? 'bg-[var(--accent-gold)] text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Fotografía</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Generated Route Timeline */}
      <div className="editorial-card rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <h3 className="font-cinzel text-lg font-bold text-[var(--accent-gold)] flex items-center gap-2">
            <Route className="w-5 h-5" />
            <span>Itinerario Recomendado ({selectedDia})</span>
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
            {rutaActual.length} paradas estratégicas
          </span>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[var(--accent-gold)] before:via-[var(--accent-bronze)] before:to-transparent">
          {rutaActual.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--accent-gold)] border-2 border-[var(--bg-app)] shadow-md ring-2 ring-[var(--accent-gold)]/30"></div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 rounded-2xl p-4 shadow-sm transition space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-mono tabular-nums font-bold text-xs shadow-sm">
                      {item.hora} h
                    </span>
                    <span className="font-cinzel font-bold text-[var(--text-primary)] text-sm sm:text-base">
                      {item.hermandad}
                    </span>
                  </div>

                  <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>{item.lugar}</span>
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1 font-serif-book">
                  {item.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                  <span className="italic flex items-center gap-1">
                    <span>Desplazamiento: {item.caminar}</span>
                  </span>
                  <button
                    onClick={() => onAskCapataz(`En mi ruta del ${selectedDia}, a las ${item.hora} h estaré en ${item.lugar} para ver a ${item.hermandad}. ¿Dónde me pongo exactamente para no perder visibilidad?`)}
                    className="text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] hover:underline flex items-center gap-1 font-medium font-cinzel"
                  >
                    <span>Consejo de sitio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: Ask Capataz to adjust */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-secondary)]">
            ¿Quieres modificar horarios o cambiar paradas según tu ritmo?
          </p>

          <button
            onClick={() => onAskCapataz(`Quiero que me adaptes la ruta del ${selectedDia} con perfil ${perfil}. Dime qué paradas clave harías tú de forma concisa.`)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--accent-gold-contrast)] font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Personalizar esta ruta con la IA</span>
          </button>
        </div>
      </div>

    </div>
  );
};
