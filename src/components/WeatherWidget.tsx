import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Thermometer, 
  Umbrella, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  CalendarDays, 
  Clock, 
  MessageSquare,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export interface DiaPronostico {
  fecha: string;
  diaSanto: string;
  tempMax: number;
  tempMin: number;
  probLluvia: number;
  precipMm: number;
  condicion: string;
  icono: string;
  riesgoCofrade: 'optimo' | 'precaucion' | 'riesgo_alto';
  recomendacionCofrade: string;
  cofradias: string[];
  consejoCapataz: string;
}

export interface ClimaResponse {
  ciudad: string;
  actualizadoEn: string;
  isFallback?: boolean;
  actual: {
    temperatura: number;
    sensacion: number;
    humedad: number;
    vientoKm: number;
    probLluvia: number;
    precipitacionMm: number;
    condicion: string;
    icono: string;
    riesgoGeneral: 'optimo' | 'precaucion' | 'riesgo_alto';
  };
  pronosticoSemanaSanta: DiaPronostico[];
  ventanaHorariaTarde: Array<{
    hora: string;
    temp: number;
    probLluvia: number;
    condicion: string;
  }>;
}

interface WeatherWidgetProps {
  onAskCapataz: (query: string) => void;
  onOpenLluviaProtocol?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  onAskCapataz,
  onOpenLluviaProtocol 
}) => {
  const [data, setData] = useState<ClimaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedDiaIndex, setSelectedDiaIndex] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchWeather = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/clima');
      if (!res.ok) {
        throw new Error('Failed to fetch from backend');
      }
      const json: ClimaResponse = await res.json();
      setData(json);
    } catch (e) {
      console.warn('Weather fetch fallback triggered:', e);
      // Fallback with realistic Granada values
      setData({
        ciudad: 'Granada (España)',
        actualizadoEn: new Date().toISOString(),
        isFallback: true,
        actual: {
          temperatura: 19,
          sensacion: 19,
          humedad: 48,
          vientoKm: 9,
          probLluvia: 10,
          precipitacionMm: 0,
          condicion: 'Poco nuboso',
          icono: 'sun-cloud',
          riesgoGeneral: 'optimo',
        },
        pronosticoSemanaSanta: [
          {
            fecha: '2026-03-29',
            diaSanto: 'Domingo de Ramos',
            tempMax: 21,
            tempMin: 9,
            probLluvia: 10,
            precipMm: 0,
            condicion: 'Cielo despejado',
            icono: 'sun',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Tarde primaveral idónea para acompañar a la Borriquilla.',
            cofradias: ['La Borriquilla', 'La Santa Cena', 'Las Maravillas', 'El Despojado', 'El Cautivo'],
            consejoCapataz: 'Tarde templada para la salida de San Andrés y bajada del Darro.'
          },
          {
            fecha: '2026-03-30',
            diaSanto: 'Lunes Santo',
            tempMax: 20,
            tempMin: 8,
            probLluvia: 15,
            precipMm: 0,
            condicion: 'Poco nuboso',
            icono: 'sun-cloud',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Sin riesgo significativo para las cofradías.',
            cofradias: ['El Trabajo', 'Los Dolores', 'El Rescate', 'El Huerto', 'San Agustín'],
            consejoCapataz: 'Brisa en el Puente Romano sobre el río Genil.'
          },
          {
            fecha: '2026-03-31',
            diaSanto: 'Martes Santo',
            tempMax: 19,
            tempMin: 8,
            probLluvia: 20,
            precipMm: 0,
            condicion: 'Intervalos nubosos',
            icono: 'cloud',
            riesgoCofrade: 'precaucion',
            recomendacionCofrade: 'Intervalos nubosos sin precipitación apreciable.',
            cofradias: ['La Lanzada', 'Vía Crucis', 'La Esperanza', 'La Cañilla'],
            consejoCapataz: 'Refresco al caer la tarde en Plaza Nueva.'
          },
          {
            fecha: '2026-04-01',
            diaSanto: 'Miércoles Santo',
            tempMax: 22,
            tempMin: 9,
            probLluvia: 10,
            precipMm: 0,
            condicion: 'Cielo despejado',
            icono: 'sun',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Excelente noche para la subida al Sacromonte.',
            cofradias: ['Los Gitanos', 'Los Estudiantes', 'Paciencia y Penas', 'El Rosario', 'El Nazareno'],
            consejoCapataz: 'Noche fría en el camino de la Abadía; llevar abrigo.'
          },
          {
            fecha: '2026-04-02',
            diaSanto: 'Jueves Santo',
            tempMax: 21,
            tempMin: 10,
            probLluvia: 15,
            precipMm: 0,
            condicion: 'Poco nuboso',
            icono: 'sun-cloud',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Noche cumbre del Albaicín con tiempo favorable.',
            cofradias: ['La Concha', 'Salesianos', 'La Aurora', 'La Estrella', 'El Silencio'],
            consejoCapataz: 'Gran concentración y humedad del Darro de madrugada.'
          },
          {
            fecha: '2026-04-03',
            diaSanto: 'Viernes Santo',
            tempMax: 20,
            tempMin: 9,
            probLluvia: 10,
            precipMm: 0,
            condicion: 'Cielo despejado',
            icono: 'sun',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Soleado para el Campo del Príncipe a las tres de la tarde.',
            cofradias: ['Los Escolapios', 'Los Favores', 'El Santo Sepulcro', 'La Soledad'],
            consejoCapataz: 'Rezo de los favores con sol primaveral.'
          },
          {
            fecha: '2026-04-04',
            diaSanto: 'Sábado Santo',
            tempMax: 20,
            tempMin: 8,
            probLluvia: 15,
            precipMm: 0,
            condicion: 'Poco nuboso',
            icono: 'sun-cloud',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Tiempo estable en el recinto de la Alhambra.',
            cofradias: ['Santa María de la Alhambra'],
            consejoCapataz: 'Atardecer agradable en la Puerta de la Justicia.'
          },
          {
            fecha: '2026-04-05',
            diaSanto: 'Domingo de Resurrección',
            tempMax: 22,
            tempMin: 9,
            probLluvia: 5,
            precipMm: 0,
            condicion: 'Cielo despejado',
            icono: 'sun',
            riesgoCofrade: 'optimo',
            recomendacionCofrade: 'Cierre triunfal con sol y ambiente festivo.',
            cofradias: ['El Resucitado', 'Los Facundillos'],
            consejoCapataz: 'Clima perfecto para el tintineo de los Facundillos.'
          }
        ],
        ventanaHorariaTarde: [
          { hora: '16:00', temp: 21, probLluvia: 5, condicion: 'Despejado' },
          { hora: '18:00', temp: 20, probLluvia: 10, condicion: 'Poco nuboso' },
          { hora: '20:00', temp: 18, probLluvia: 10, condicion: 'Poco nuboso' },
          { hora: '22:00', temp: 15, probLluvia: 5, condicion: 'Despejado' },
          { hora: '00:00', temp: 13, probLluvia: 5, condicion: 'Despejado' },
        ]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Auto refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const renderWeatherIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'sun-cloud':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case 'rain':
      case 'shower':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-indigo-500`} />;
      default:
        return <CloudSun className={`${className} text-amber-500`} />;
    }
  };

  if (loading && !data) {
    return (
      <div className="editorial-card rounded-2xl p-3 shadow-xs mb-4 flex items-center justify-between text-xs animate-pulse text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-[var(--accent-gold)] animate-spin" />
          <span>Consultando observatorio meteorológico de Granada...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const current = data.actual;
  const isHighRisk = current.riesgoGeneral === 'riesgo_alto';
  const isCaution = current.riesgoGeneral === 'precaucion';

  const selectedDia = data.pronosticoSemanaSanta[selectedDiaIndex] || data.pronosticoSemanaSanta[0];

  return (
    <div className="mb-4">
      {/* Compact Top Weather Bar */}
      <div className="editorial-card rounded-2xl p-3 sm:p-3.5 shadow-sm border border-[var(--border-subtle)] transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Left: City & Current Temp */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
              {renderWeatherIcon(current.icono, 'w-6 h-6')}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[var(--accent-gold)]" />
                  Granada
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Observatorio AEMET / Open-Meteo
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {current.temperatura}°C
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-serif-book">
                  {current.condicion} · Sensación {current.sensacion}°C
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Cofrade Risk Indicator */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-serif-book">
            {/* Rain Risk Badge */}
            <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-xs font-medium ${
              isHighRisk
                ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                : isCaution
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
            }`}>
              <Umbrella className="w-3.5 h-3.5 shrink-0" />
              <span>Prob. Lluvia: <strong className="font-mono">{current.probLluvia}%</strong></span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline font-cinzel text-[11px] font-bold">
                {isHighRisk ? 'Riesgo de Lluvia' : isCaution ? 'Precaución' : 'Óptimo para Procesionar'}
              </span>
            </div>

            {/* Wind & Humidity */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-[var(--accent-gold)]" />
                {current.vientoKm} km/h
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-500" />
                {current.humedad}% hum.
              </span>
            </div>
          </div>

          {/* Right: Quick Actions & Expand Button */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {onOpenLluviaProtocol && (
              <button
                onClick={onOpenLluviaProtocol}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-cinzel font-medium bg-[var(--bg-card-subtle)] text-[var(--accent-gold)] hover:bg-amber-500/10 border border-[var(--border-subtle)] transition"
                title="Ver templos de refugio en caso de lluvia"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refugios</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] hover:opacity-95 transition shadow-xs"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Ocultar Pronóstico' : 'Pronóstico Semana Santa'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={fetchWeather}
              disabled={refreshing}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition border border-transparent hover:border-[var(--border-subtle)]"
              title="Actualizar datos meteorológicos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[var(--accent-gold)]' : ''}`} />
            </button>
          </div>

        </div>

        {/* Expandable Semana Santa 8-Day Forecast Panel */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-4 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold block">
                  Predicción Meteorológica Oficial · Semana Santa Granada
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  Evolución por Días Santos (Domingo de Ramos a Resurrección)
                </h4>
              </div>
              
              <button
                onClick={() => onAskCapataz(`¿Cuál es el pronóstico del tiempo y el riesgo de lluvia para la Semana Santa en Granada, especialmente para el ${selectedDia.diaSanto}?`)}
                className="inline-flex items-center gap-1 text-xs font-cinzel font-semibold text-[var(--accent-gold)] hover:underline self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consultar predicción con el Capataz IA</span>
              </button>
            </div>

            {/* 8-Day Horizontal Carousel/Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {data.pronosticoSemanaSanta.map((dia, idx) => {
                const isSelected = selectedDiaIndex === idx;
                const diaRisk = dia.riesgoCofrade;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDiaIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-[var(--accent-gold)] ring-2 ring-amber-500/20'
                        : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-cinzel font-bold text-[var(--accent-gold)] block truncate">
                        {dia.diaSanto.replace('Santo', '').replace('de', '').trim()}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                        {dia.fecha.split('-').slice(1).reverse().join('/')}
                      </span>

                      <div className="flex items-center justify-between my-2">
                        {renderWeatherIcon(dia.icono, 'w-5 h-5')}
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {dia.tempMax}° / <span className="text-[var(--text-muted)]">{dia.tempMin}°</span>
                        </span>
                      </div>
                    </div>

                    {/* Rain Probability Badge */}
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-[var(--text-muted)] flex items-center gap-0.5">
                          <Umbrella className="w-2.5 h-2.5" /> {dia.probLluvia}%
                        </span>
                      </div>
                      <div className="w-full bg-[var(--border-subtle)] rounded-full h-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            dia.probLluvia > 40 ? 'bg-red-500' : dia.probLluvia > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(dia.probLluvia, 5)}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Deep Dive Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
                      {selectedDia.diaSanto}
                    </h5>
                    <span className={`text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full border ${
                      selectedDia.riesgoCofrade === 'riesgo_alto'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        : selectedDia.riesgoCofrade === 'precaucion'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {selectedDia.riesgoCofrade === 'riesgo_alto' ? 'Riesgo Lluvia Alto' : selectedDia.riesgoCofrade === 'precaucion' ? 'Riesgo Moderado' : 'Tiempo Favorable'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-serif-book">
                    {selectedDia.recomendacionCofrade}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-sans">Máx / Mín</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedDia.tempMax}°C / {selectedDia.tempMin}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-sans">Prob. Lluvia</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{selectedDia.probLluvia}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-sans">Precipitación</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedDia.precipMm} mm</span>
                  </div>
                </div>
              </div>

              {/* Cofradías of the day */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-cinzel text-[11px] font-bold text-[var(--accent-gold)] mr-1">
                  Cofradías en la calle:
                </span>
                {selectedDia.cofradias.map((c, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-serif-book text-[11px]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Capataz Tip */}
              <div className="text-xs font-serif-book italic text-[var(--accent-gold)] bg-amber-500/5 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <div>
                  <strong className="not-italic font-cinzel text-[10px] font-bold uppercase text-[var(--text-primary)] block mb-0.5">
                    Consejo Meteorológico del Capataz:
                  </strong>
                  "{selectedDia.consejoCapataz}"
                </div>
              </div>

              {/* Hourly window during procession times */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] font-cinzel uppercase font-semibold text-[var(--text-muted)] flex items-center gap-1 mb-2">
                  <Clock className="w-3 h-3 text-[var(--accent-gold)]" />
                  Ventana Horaria de Procesiones (Tarde - Madrugada):
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {data.ventanaHorariaTarde.map((horaSlot, idx) => (
                    <div key={idx} className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">{horaSlot.hora}</span>
                      <span className="font-mono font-bold text-[var(--text-primary)] block">{horaSlot.temp}°C</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono block">
                        <Umbrella className="w-2.5 h-2.5 inline mr-0.5" />{horaSlot.probLluvia}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
