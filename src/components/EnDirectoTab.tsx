import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  Sliders, 
  Radio, 
  Church, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { HERMANDADES_GRANADA, DIAS_SEMANA_SANTA, Hermandad } from '../data/hermandades';

interface EnDirectoTabProps {
  onAskCapataz: (query: string) => void;
  onSelectHermandad: (id: string) => void;
}

export const EnDirectoTab: React.FC<EnDirectoTabProps> = ({ 
  onAskCapataz, 
  onSelectHermandad 
}) => {
  const [selectedDia, setSelectedDia] = useState<string>('Jueves Santo');
  const [horaSeleccionada, setHoraSeleccionada] = useState<number>(21.5); // 21:30 by default

  // Format decimal hour to HH:MM (e.g. 21.5 -> "21:30", 25.5 -> "01:30")
  const formatHora = (val: number) => {
    let normalized = val;
    let dayNote = '';
    if (normalized >= 24) {
      normalized -= 24;
      dayNote = ' (madrugada)';
    }
    const h = Math.floor(normalized);
    const m = Math.round((normalized - h) * 60);
    const hStr = h < 10 ? `0${h}` : `${h}`;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    return `${hStr}:${mStr} h${dayNote}`;
  };

  // Filter brotherhoods for selected day
  const hermandadesDelDia = useMemo(() => {
    return HERMANDADES_GRANADA.filter(h => h.dia.toLowerCase().includes(selectedDia.toLowerCase()));
  }, [selectedDia]);

  // Compute status for each brotherhood at current selected hour
  const cortejosEnLaCalle = useMemo(() => {
    return hermandadesDelDia.map(h => {
      const isEnLaCalle = horaSeleccionada >= h.horaSalidaNum && horaSeleccionada <= h.horaRegresoNum;
      
      let estado = 'Aún en templo';
      let estadoTone = 'text-stone-400';
      let tramoAproximado = 'Esperando hora de salida';

      if (isEnLaCalle) {
        const duracionTotal = h.horaRegresoNum - h.horaSalidaNum;
        const progreso = (horaSeleccionada - h.horaSalidaNum) / duracionTotal;

        if (progreso < 0.25) {
          estado = 'Salida y barrio de ida';
          estadoTone = 'text-amber-300 font-semibold';
          tramoAproximado = `Saliendo de ${h.sede} y avanzando por ${h.barrio}`;
        } else if (progreso >= 0.25 && progreso < 0.6) {
          estado = 'Carrera Oficial y Catedral';
          estadoTone = 'text-amber-200 font-bold';
          tramoAproximado = `En Ganivet, Pasiegas o interior de la Santa Iglesia Catedral`;
        } else if (progreso >= 0.6 && progreso < 0.85) {
          estado = 'Regreso hacia el barrio';
          estadoTone = 'text-amber-300 font-semibold';
          tramoAproximado = `Subiendo de regreso hacia su sede canónica`;
        } else {
          estado = 'Último tramo / Recogida';
          estadoTone = 'text-amber-400 font-semibold';
          tramoAproximado = `Llegada y maniobra de encierro en ${h.sede}`;
        }
      } else if (horaSeleccionada > h.horaRegresoNum) {
        estado = 'Ya recogida en templo';
        estadoTone = 'text-stone-500';
        tramoAproximado = `Paso recogido a las ${h.regreso}`;
      }

      return {
        ...h,
        isEnLaCalle,
        estado,
        estadoTone,
        tramoAproximado,
      };
    });
  }, [hermandadesDelDia, horaSeleccionada]);

  const activasAhora = cortejosEnLaCalle.filter(c => c.isEnLaCalle);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & Simulator Controls */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Radio className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Semana Santa en Directo</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Simulador horario: descubre al instante qué cofradías están en la calle y por dónde discurren.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--accent-gold)] font-cinzel font-semibold flex items-center gap-1.5 bg-[var(--bg-card-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans font-normal">Cortejos en la calle:</span>
              <span className="text-[var(--accent-gold)] font-bold font-mono tabular-nums">{activasAhora.length}</span>
            </span>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="border-t border-[var(--border-subtle)] pt-3">
          <label className="text-[11px] font-cinzel font-bold text-[var(--accent-gold)] uppercase tracking-wider block mb-2">
            Selecciona el Día a Simular:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DIAS_SEMANA_SANTA.filter(d => d !== 'Todos los días').map(dia => {
              const isSelected = selectedDia === dia;
              return (
                <button
                  key={dia}
                  onClick={() => {
                    setSelectedDia(dia);
                    if (dia === 'Domingo de Resurrección') {
                      setHoraSeleccionada(12.5);
                    } else if (dia === 'Viernes Santo') {
                      setHoraSeleccionada(15.0);
                    } else {
                      setHoraSeleccionada(21.0);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#854d0e] dark:bg-amber-600 text-white font-bold shadow-md border-2 border-[#713f12] dark:border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-semibold border-2 border-stone-300 dark:border-stone-700 hover:border-amber-600 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider & Time display */}
        <div className="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--accent-gold)] font-cinzel font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Hora simulada:</span>
            </span>
            <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-[var(--accent-gold)] bg-[var(--bg-card)] px-3.5 py-1 rounded-lg border border-[var(--border-subtle)] shadow-sm">
              {formatHora(horaSeleccionada)}
            </span>
          </div>

          <input
            type="range"
            min={selectedDia === 'Domingo de Resurrección' ? 10 : 14.5}
            max={selectedDia === 'Domingo de Resurrección' ? 16 : 28}
            step={0.25}
            value={horaSeleccionada}
            onChange={(e) => setHoraSeleccionada(parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-[var(--bg-subtle)] rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono tabular-nums">
            <span>{selectedDia === 'Domingo de Resurrección' ? '10:00 h' : '14:30 h'}</span>
            <span>{selectedDia === 'Domingo de Resurrección' ? '13:00 h (Catedral)' : '21:00 h (C. Oficial)'}</span>
            <span>{selectedDia === 'Domingo de Resurrección' ? '16:00 h' : '04:00 h (Madrugada)'}</span>
          </div>
        </div>

        {/* Ask Capataz quick recommendation for this time */}
        <div className="flex justify-end">
          <button
            onClick={() => onAskCapataz(`¿Dónde me pongo exactamente el ${selectedDia} a las ${formatHora(horaSeleccionada)} para ver los mejores momentos cofrades? Responde conciso.`)}
            className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-white font-cinzel font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consultar qué ver a las {formatHora(horaSeleccionada)}</span>
          </button>
        </div>
      </div>

      {/* List of brotherhoods at this hour */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cortejosEnLaCalle.map(h => (
          <div
            key={h.id}
            className={`editorial-card rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between ${
              h.isEnLaCalle
                ? 'border-[var(--border-strong)] shadow-md'
                : 'opacity-65 border-[var(--border-subtle)]'
            }`}
          >
            <div>
              {/* Header Status & Hours */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                <span className={`text-xs font-cinzel font-semibold ${h.isEnLaCalle ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
                  {h.estado}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono tabular-nums">
                  {h.salida} &rarr; {h.regreso}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--text-primary)] mb-0.5">
                {h.nombre}
              </h3>
              {h.apodo && (
                <p className="text-xs text-[var(--accent-gold)] italic mb-2">
                  "{h.apodo}"
                </p>
              )}

              {/* Live Location / Tramo */}
              <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] mb-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[var(--accent-gold)] font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ubicación estimada:</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed font-sans">
                  {h.tramoAproximado}
                </p>
              </div>

              {/* Quick schedule breakdown */}
              <div className="grid grid-cols-3 gap-1.5 text-xs text-center bg-[var(--bg-card-subtle)] p-2 rounded-lg font-mono tabular-nums text-[var(--text-secondary)] mb-3 border border-[var(--border-subtle)]">
                <div>
                  <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Salida</span>
                  <span className="font-bold text-[var(--text-primary)]">{h.salida}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Ganivet</span>
                  <span className="font-bold text-[var(--accent-gold)]">{h.carreraOficial}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] text-[10px] block uppercase font-sans">Recogida</span>
                  <span className="font-bold text-[var(--text-primary)]">{h.regreso}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex gap-2">
              <button
                onClick={() => onAskCapataz(`¿Por dónde va exactamente ${h.nombre} sobre las ${formatHora(horaSeleccionada)} y cuál es el mejor punto para verla?`)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] text-xs font-cinzel font-medium flex items-center justify-center gap-1.5 transition border border-[var(--border-subtle)] shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Preguntar a la IA</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
