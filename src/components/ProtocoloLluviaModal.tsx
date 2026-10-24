import React from 'react';
import { 
  CloudRain, 
  X, 
  ShieldAlert, 
  Church, 
  Clock, 
  MessageSquare
} from 'lucide-react';

interface ProtocoloLluviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskCapataz: (query: string) => void;
}

export const ProtocoloLluviaModal: React.FC<ProtocoloLluviaModalProps> = ({ 
  isOpen, 
  onClose,
  onAskCapataz 
}) => {
  if (!isOpen) return null;

  const templosRefugio = [
    { nombre: 'Santa Iglesia Catedral Metropolitana', zona: 'Centro / Carrera Oficial', desc: 'Refugio principal para todas las cofradías que se encuentren en Ganivet, Mesones o Pasiegas.' },
    { nombre: 'Iglesia de Santo Domingo', zona: 'Realejo', desc: 'Refugio estratégico para las cofradías del Realejo y cruces de Pavaneras.' },
    { nombre: 'Monasterio de San Jerónimo', zona: 'Centro / Universidad', desc: 'Refugio para cortejos que discurren por San Juan de Dios, Universidad y San Jerónimo.' },
    { nombre: 'Iglesia de San Pedro y San Pablo', zona: 'Carrera del Darro', desc: 'Refugio vital para cofradías en el Darro antes de iniciar las cuestas del Albayzín.' },
    { nombre: 'Parroquia de Santa María Magdalena', zona: 'Centro / Gracia', desc: 'Refugio para cortejos en calle Puentezuelas, Recogidas y Gracia.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-card)] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-[var(--text-primary)] space-y-4 max-h-[90vh] overflow-y-auto scrollbar-cofrade border-2 border-[var(--border-strong)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-sm">
            <CloudRain className="w-6 h-6 text-sky-100" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Protocolo de Lluvia y Refugios
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-serif-book">
              Normativa de la Real Federación de Cofradías de Granada en caso de lluvia
            </p>
          </div>
        </div>

        {/* 3 Main Rules */}
        <div className="space-y-2.5 text-xs font-serif-book">
          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1">
            <span className="font-cinzel font-bold text-[var(--accent-gold)] flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4" />
              1. Moratoria reglamentaria de salida
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              La Junta de Gobierno de cada hermandad puede solicitar a la Federación una moratoria de <strong>hasta 30 a 60 minutos</strong> si los partes meteorológicos indican una mejoría inmediata.
            </p>
          </div>

          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1">
            <span className="font-cinzel font-bold text-[var(--accent-gold)] flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4" />
              2. Si la lluvia sorprende en la calle
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Las imágenes se cubren de inmediato con plásticos protectores. Si el paso ha superado Ángel Ganivet, se acelera el paso con marchas vivas hacia el interior de la <strong>Catedral de Granada</strong> para quedar a cubierto.
            </p>
          </div>

          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1">
            <span className="font-cinzel font-bold text-[var(--accent-gold)] flex items-center gap-1.5 text-sm">
              <Church className="w-4 h-4" />
              3. Templos de Refugio Oficiales
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Si la cofradía no ha llegado al centro, buscará el templo más cercano habilitado para guarecer los pasos y nazarenos.
            </p>
          </div>
        </div>

        {/* List of Shelters */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-wider block font-bold">
            Principales Templos de Refugio en Granada:
          </span>
          <div className="space-y-1.5 text-xs">
            {templosRefugio.map((t, idx) => (
              <div key={idx} className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-cinzel font-bold text-[var(--text-primary)] text-[12px]">{t.nombre}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] font-serif-book">{t.desc}</p>
                </div>
                <span className="text-[10px] text-[var(--accent-gold)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)] whitespace-nowrap shrink-0 font-cinzel font-semibold">
                  {t.zona}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action inside modal */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onAskCapataz('¿Qué protocolo sigue la Semana Santa de Granada si llueve y qué cofradías se refugian en la Catedral? Responde conciso.');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--accent-gold-contrast)] font-cinzel font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consultar protocolo detallado a la IA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
