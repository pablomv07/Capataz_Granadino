import React, { useState } from 'react';
import { 
  Scale, 
  X, 
  MessageSquare
} from 'lucide-react';
import { HERMANDADES_GRANADA } from '../data/hermandades';

interface ComparadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskCapataz: (query: string) => void;
}

export const ComparadorModal: React.FC<ComparadorModalProps> = ({ 
  isOpen, 
  onClose,
  onAskCapataz 
}) => {
  const [idA, setIdA] = useState<string>('la-aurora');
  const [idB, setIdB] = useState<string>('los-gitanos');

  if (!isOpen) return null;

  const hA = HERMANDADES_GRANADA.find(h => h.id === idA) || HERMANDADES_GRANADA[0];
  const hB = HERMANDADES_GRANADA.find(h => h.id === idB) || HERMANDADES_GRANADA[1];

  const duracionA = (hA.horaRegresoNum - hA.horaSalidaNum).toFixed(1);
  const duracionB = (hB.horaRegresoNum - hB.horaSalidaNum).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-card)] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative text-[var(--text-primary)] space-y-5 max-h-[90vh] overflow-y-auto scrollbar-cofrade border-2 border-[var(--border-strong)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] flex items-center justify-center shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Comparador Cofrade Cara a Cara
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-serif-book">
              Compara dos hermandades de Granada en cortejo, horas en la calle y patrimonio
            </p>
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <div>
            <label className="text-xs font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Cofradía A:
            </label>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[var(--accent-gold)] transition cursor-pointer shadow-sm"
            >
              {HERMANDADES_GRANADA.map(h => (
                <option key={h.id} value={h.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1 font-sans">
                  {h.nombre} ({h.dia})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-cinzel font-bold text-[var(--accent-gold)] block mb-1">
              Cofradía B:
            </label>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[var(--accent-gold)] transition cursor-pointer shadow-sm"
            >
              {HERMANDADES_GRANADA.map(h => (
                <option key={h.id} value={h.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1 font-sans">
                  {h.nombre} ({h.dia})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden text-xs">
          <div className="grid grid-cols-3 bg-[var(--bg-subtle)] p-3 text-center font-cinzel font-bold text-[var(--accent-gold)] border-b border-[var(--border-subtle)]">
            <span className="text-left text-[var(--text-secondary)]">Aspecto</span>
            <span>{hA.nombre}</span>
            <span>{hB.nombre}</span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {/* Día */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-left text-[var(--text-muted)] font-medium">Día de salida</span>
              <span className="font-bold text-[var(--accent-gold)] font-cinzel">{hA.dia}</span>
              <span className="font-bold text-[var(--accent-gold)] font-cinzel">{hB.dia}</span>
            </div>

            {/* Sede y Barrio */}
            <div className="grid grid-cols-3 p-3 items-center text-center bg-[var(--bg-card)]">
              <span className="text-left text-[var(--text-muted)] font-medium">Barrio / Sede</span>
              <span className="text-[var(--text-secondary)] font-serif-book">{hA.barrio}</span>
              <span className="text-[var(--text-secondary)] font-serif-book">{hB.barrio}</span>
            </div>

            {/* Horas en la calle */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-left text-[var(--text-muted)] font-medium">Horas en la calle</span>
              <span className="font-mono tabular-nums text-[var(--text-primary)] font-bold">{duracionA} h aprox.</span>
              <span className="font-mono tabular-nums text-[var(--text-primary)] font-bold">{duracionB} h aprox.</span>
            </div>

            {/* Horarios clave */}
            <div className="grid grid-cols-3 p-3 items-center text-center bg-[var(--bg-card)] font-mono tabular-nums text-[11px]">
              <span className="text-left text-[var(--text-muted)] font-medium font-sans">Salida → Recogida</span>
              <span className="text-[var(--text-primary)]">{hA.salida} &rarr; {hA.regreso}</span>
              <span className="text-[var(--text-primary)]">{hB.salida} &rarr; {hB.regreso}</span>
            </div>

            {/* Carrera Oficial */}
            <div className="grid grid-cols-3 p-3 items-center text-center font-mono tabular-nums text-[11px]">
              <span className="text-left text-[var(--text-muted)] font-medium font-sans">Ganivet (C.O.)</span>
              <span className="text-[var(--accent-gold)] font-bold">{hA.carreraOficial}</span>
              <span className="text-[var(--accent-gold)] font-bold">{hB.carreraOficial}</span>
            </div>

            {/* Pasos y Nazarenos */}
            <div className="grid grid-cols-3 p-3 items-center text-center bg-[var(--bg-card)]">
              <span className="text-left text-[var(--text-muted)] font-medium">Pasos / Cortejo</span>
              <span className="text-[var(--text-secondary)]">{hA.pasos} · ~{hA.nazarenos} nazarenos</span>
              <span className="text-[var(--text-secondary)]">{hB.pasos} · ~{hB.nazarenos} nazarenos</span>
            </div>

            {/* Música */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-left text-[var(--text-muted)] font-medium">Acompañamiento</span>
              <span className="text-[11px] text-[var(--text-secondary)] font-serif-book">{hA.musica}</span>
              <span className="text-[11px] text-[var(--text-secondary)] font-serif-book">{hB.musica}</span>
            </div>
          </div>
        </div>

        {/* AI Comparative Verdict Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onAskCapataz(`Hazme una comparativa cofrade concisa y de calidad entre la hermandad de ${hA.nombre} y la de ${hB.nombre}: diferencias de estilo, devoción y momentos imperdibles.`);
            }}
            className="w-full py-3 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--accent-gold-contrast)] font-cinzel font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Pedir Veredicto Comparativo a El Capataz</span>
          </button>
        </div>

      </div>
    </div>
  );
};
