import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Monitor, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'iphone' | 'android' | 'pc'>(
    isIOS ? 'iphone' : 'android'
  );

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await triggerInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="cofrade-card rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-stone-100 space-y-5 border border-amber-500/30">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900/60 border border-amber-500/20 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-cinzel font-bold text-xl shadow-lg border border-amber-300/40">
            CG
          </div>
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold gold-gradient-text">
              Descargar El Capataz Granadino
            </h3>
            <p className="text-xs text-stone-300">
              Instala la aplicación en tu móvil o PC como una app nativa
            </p>
          </div>
        </div>

        {/* Native 1-click install button if available (Chrome / Android / Edge) */}
        {isInstallable && (
          <div className="bg-[#0e0417] border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="text-left">
              <span className="font-cinzel text-sm font-bold text-amber-300 block">
                ¡Instalación directa disponible!
              </span>
              <span className="text-xs text-stone-300">
                Añade el icono a tu pantalla de inicio en un toque.
              </span>
            </div>
            <button
              onClick={handleNativeInstall}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-cinzel font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Instalar ahora</span>
            </button>
          </div>
        )}

        {/* Tabs for platform instructions */}
        <div className="flex bg-[#0e0417] p-1 rounded-xl border border-amber-500/25 text-xs">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'android'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-amber-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-2 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'iphone'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-amber-200'
            }`}
          >
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActiveTab('pc')}
            className={`flex-1 py-2 rounded-lg font-cinzel font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'pc'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-amber-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>PC / Mac</span>
          </button>
        </div>

        {/* Instruction Content */}
        <div className="bg-[#0e0417] rounded-2xl p-4 border border-amber-500/20 text-xs sm:text-sm space-y-3 font-sans">
          {activeTab === 'android' && (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  1
                </span>
                <p className="text-stone-200">
                  Abre esta página en <strong>Google Chrome</strong> en tu móvil Android.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  2
                </span>
                <p className="text-stone-200">
                  Toca los <strong>tres puntos (⋮)</strong> en la esquina superior derecha del navegador.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  3
                </span>
                <p className="text-stone-200">
                  Selecciona <strong className="text-amber-300">«Instalar aplicación»</strong> o <strong className="text-amber-300">«Añadir a pantalla de inicio»</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'iphone' && (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  1
                </span>
                <p className="text-stone-200">
                  Abre el enlace en el navegador <strong>Safari</strong> de tu iPhone o iPad.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  2
                </span>
                <p className="text-stone-200 flex items-center gap-1.5 flex-wrap">
                  <span>Toca el botón</span>
                  <strong className="text-amber-300 flex items-center gap-1 bg-[#140624] px-2 py-0.5 rounded border border-amber-500/30">
                    <Share className="w-3.5 h-3.5" /> Compartir
                  </strong>
                  <span>(el icono del cuadrado con la flecha hacia arriba abajo en Safari).</span>
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  3
                </span>
                <p className="text-stone-200 flex items-center gap-1.5 flex-wrap">
                  <span>Baja y pulsa</span>
                  <strong className="text-amber-300 flex items-center gap-1 bg-[#140624] px-2 py-0.5 rounded border border-amber-500/30">
                    <PlusSquare className="w-3.5 h-3.5" /> Añadir a pantalla de inicio
                  </strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pc' && (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  1
                </span>
                <p className="text-stone-200">
                  En <strong>Chrome</strong> o <strong>Edge</strong>, busca el icono de <strong>ordenador con una flecha hacia abajo</strong> en la barra de direcciones (a la derecha de la URL).
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  2
                </span>
                <p className="text-stone-200">
                  Haz clic en <strong className="text-amber-300">«Instalar El Capataz Granadino»</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 text-xs">
                  3
                </span>
                <p className="text-stone-200">
                  Se abrirá como una aplicación de escritorio autónoma sin barras del navegador.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-300 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sin ocupar almacenamiento</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Acceso directo con icono propio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sin tienda de aplicaciones</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Pantalla completa inmersiva</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-cinzel font-medium text-xs transition"
        >
          Entendido
        </button>

      </div>
    </div>
  );
};
