/// <reference types="google.maps" />
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Church, 
  Clock, 
  Compass, 
  Navigation, 
  Layers, 
  MessageSquare, 
  ChevronRight, 
  Info, 
  Sparkles,
  Maximize2,
  Calendar,
  Footprints,
  Eye,
  X
} from 'lucide-react';
import { HERMANDADES_GRANADA, DIAS_SEMANA_SANTA } from '../data/hermandades';
import { 
  PUNTOS_CLAVE_MAPA, 
  CARRERA_OFICIAL_PUNTOS, 
  getItinerarioMapData, 
  PuntoInteresGranada,
  CofradeLatLng,
  ParadaItinerario
} from '../data/cofradeMapData';

// API Key provisioned via Google Maps Platform Demo Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBulYjMfqHFXSdi6tEav8vzwR_7Ns4oLOc';

// Polyline component rendering the itinerary route on the Google Map
function ItineraryPolyline({
  path,
  color = '#B45309',
  strokeWeight = 4,
}: {
  path: CofradeLatLng[];
  color?: string;
  strokeWeight?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length < 2) return;

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight,
      zIndex: 20,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, color, strokeWeight]);

  return null;
}

// Carrera Oficial official route polyline (sacred purple / gold dashed)
function CarreraOficialPolyline() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 3,
    };

    const polyline = new google.maps.Polyline({
      path: CARRERA_OFICIAL_PUNTOS,
      geodesic: true,
      strokeColor: '#7C3AED', // Royal violet
      strokeOpacity: 0,
      strokeWeight: 5,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '16px',
        },
      ],
      zIndex: 10,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map]);

  return null;
}

// Camera pan & fit bounds controller
function MapCameraController({
  targetCoords,
  routeBounds,
}: {
  targetCoords: CofradeLatLng | null;
  routeBounds: CofradeLatLng[] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(16);
    } else if (routeBounds && routeBounds.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      routeBounds.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [map, targetCoords, routeBounds]);

  return null;
}

interface CofradeInteractiveMapProps {
  onAskCapataz: (query: string) => void;
  initialHermandadId?: string | null;
  onSelectHermandad?: (id: string) => void;
}

export const CofradeInteractiveMap: React.FC<CofradeInteractiveMapProps> = ({
  onAskCapataz,
  initialHermandadId,
  onSelectHermandad,
}) => {
  // Currently selected brotherhood
  const [selectedHermandadId, setSelectedHermandadId] = useState<string>(
    initialHermandadId || 'borriquilla'
  );

  // Day filter for brotherhood selector
  const [filterDia, setFilterDia] = useState<string>('Todos los días');

  // Layers toggle
  const [showItinerario, setShowItinerario] = useState<boolean>(true);
  const [showPuntosClave, setShowPuntosClave] = useState<boolean>(true);
  const [selectedBarrioPuntos, setSelectedBarrioPuntos] = useState<string>('Todos');

  // Currently inspected spot (either a Punto Clave or a Route Milestone)
  const [inspectedPunto, setInspectedPunto] = useState<PuntoInteresGranada | null>(null);
  const [inspectedParada, setInspectedParada] = useState<ParadaItinerario | null>(null);

  // Target coordinates for smooth pan
  const [cameraTarget, setCameraTarget] = useState<CofradeLatLng | null>(null);

  // Update selected if prop changes
  useEffect(() => {
    if (initialHermandadId) {
      setSelectedHermandadId(initialHermandadId);
    }
  }, [initialHermandadId]);

  // Current hermandad metadata
  const currentHermandad = useMemo(() => {
    return HERMANDADES_GRANADA.find(h => h.id === selectedHermandadId) || HERMANDADES_GRANADA[0];
  }, [selectedHermandadId]);

  // Itinerary map data for the selected brotherhood
  const itinerarioData = useMemo(() => {
    return getItinerarioMapData(currentHermandad.id, {
      nombre: currentHermandad.nombre,
      dia: currentHermandad.dia,
      salida: currentHermandad.salida,
      carreraOficial: currentHermandad.carreraOficial,
      catedral: currentHermandad.catedral,
      regreso: currentHermandad.regreso,
    });
  }, [currentHermandad]);

  // Filtered brotherhoods for selection
  const filteredHermandades = useMemo(() => {
    if (filterDia === 'Todos los días') return HERMANDADES_GRANADA;
    return HERMANDADES_GRANADA.filter(h => h.dia === filterDia);
  }, [filterDia]);

  // Filtered points of interest
  const filteredPuntosClave = useMemo(() => {
    if (selectedBarrioPuntos === 'Todos') return PUNTOS_CLAVE_MAPA;
    return PUNTOS_CLAVE_MAPA.filter(p => p.barrio === selectedBarrioPuntos);
  }, [selectedBarrioPuntos]);

  const handleSelectBrotherhood = (id: string) => {
    setSelectedHermandadId(id);
    setInspectedPunto(null);
    setInspectedParada(null);
    setCameraTarget(null);
    if (onSelectHermandad) {
      onSelectHermandad(id);
    }
  };

  const handleFocusCenter = () => {
    setCameraTarget({ lat: 37.1773, lng: -3.5986 });
    setInspectedPunto(null);
    setInspectedParada(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Brotherhood Selection & Day Filter */}
      <div className="editorial-card rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold">
                <Navigation className="w-3 h-3" /> Visualización Cartográfica Oficial
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                Google Maps GPS
              </span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Itinerario & Puntos Clave de Granada
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-serif-book">
              Sigue el trazado real de cada cofradía por el Albaicín, Sacromonte, Realejo y Carrera Oficial.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFocusCenter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-medium bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition shadow-xs"
              title="Centrar mapa en Granada"
            >
              <Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Centrar Granada</span>
            </button>
            <button
              onClick={() => onAskCapataz(`¿Cuál es el mejor punto y hora recomendada para ver a ${currentHermandad.nombre} (${currentHermandad.dia})?`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] hover:opacity-95 transition shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consultar al Capataz</span>
            </button>
          </div>
        </div>

        {/* Brotherhood & Day Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-[var(--border-subtle)]">
          {/* Day selection */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1 font-cinzel">
              Día de la Semana Santa
            </label>
            <select
              value={filterDia}
              onChange={(e) => setFilterDia(e.target.value)}
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] font-serif-book cursor-pointer"
            >
              {DIAS_SEMANA_SANTA.map(d => (
                <option key={d} value={d} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Brotherhood selection */}
          <div className="sm:col-span-8">
            <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1 font-cinzel">
              Seleccionar Cofradía ({filteredHermandades.length} disponibles)
            </label>
            <select
              value={selectedHermandadId}
              onChange={(e) => handleSelectBrotherhood(e.target.value)}
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] font-serif-book cursor-pointer"
            >
              {filteredHermandades.map(h => (
                <option key={h.id} value={h.id} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {h.dia} — {h.nombre} ({h.barrio})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Layer Toggles & Barrio pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowItinerario(!showItinerario)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                showItinerario
                  ? 'bg-amber-500/15 border-amber-500/40 text-[var(--accent-gold)] font-bold'
                  : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Itinerario Cofradía</span>
            </button>

            <button
              onClick={() => setShowPuntosClave(!showPuntosClave)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                showPuntosClave
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Puntos Clave ({filteredPuntosClave.length})</span>
            </button>
          </div>

          {/* Barrio Filter for Puntos */}
          {showPuntosClave && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['Todos', 'Albaicín', 'Sacromonte', 'Realejo', 'Centro', 'Alhambra'].map(barrio => (
                <button
                  key={barrio}
                  onClick={() => setSelectedBarrioPuntos(barrio)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-cinzel transition whitespace-nowrap ${
                    selectedBarrioPuntos === barrio
                      ? 'bg-[var(--text-primary)] text-[var(--bg-card)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {barrio}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Canvas and Overlay Info Card */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-md bg-[var(--bg-card)]">
        
        {/* Map Container: height strictly defined and responsive for all device viewports */}
        <div className="w-full h-[400px] sm:h-[500px] md:h-[580px] relative">
          <APIProvider
            apiKey={GOOGLE_MAPS_API_KEY}
            language="es"
            region="ES"
          >
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={{ lat: 37.1773, lng: -3.5986 }}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={false}
              fullscreenControl={true}
              style={{ width: '100%', height: '100%' }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              {/* Dynamic Camera Controller */}
              <MapCameraController
                targetCoords={cameraTarget}
                routeBounds={showItinerario ? itinerarioData.rutaPolilinea : null}
              />

              {/* Carrera Oficial permanent dashed guidance line */}
              <CarreraOficialPolyline />

              {/* Brotherhood Itinerary Polyline */}
              {showItinerario && (
                <ItineraryPolyline
                  path={itinerarioData.rutaPolilinea}
                  color={itinerarioData.color}
                  strokeWeight={5}
                />
              )}

              {/* Brotherhood Milestone Markers */}
              {showItinerario && itinerarioData.paradas.map((parada, idx) => {
                const isSalida = parada.tipo === 'salida';
                const isCatedral = parada.tipo === 'catedral';
                const isGanivet = parada.tipo === 'carrera_oficial';
                const isRegreso = parada.tipo === 'regreso';

                return (
                  <AdvancedMarker
                    key={`parada-${idx}`}
                    position={parada.coordenadas}
                    onClick={() => {
                      setInspectedParada(parada);
                      setInspectedPunto(null);
                      setCameraTarget(parada.coordenadas);
                    }}
                    title={`${parada.nombre} (${parada.hora})`}
                  >
                    <div className="group cursor-pointer transform hover:scale-110 transition-transform">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border-2 text-[11px] font-bold ${
                        isSalida
                          ? 'bg-amber-600 text-white border-amber-200'
                          : isCatedral
                          ? 'bg-rose-700 text-white border-rose-200'
                          : isGanivet
                          ? 'bg-purple-700 text-white border-purple-200'
                          : 'bg-zinc-800 text-white border-zinc-400'
                      }`}>
                        {isSalida ? (
                          <Church className="w-3.5 h-3.5" />
                        ) : isCatedral ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : isGanivet ? (
                          <Navigation className="w-3.5 h-3.5" />
                        ) : (
                          <Footprints className="w-3.5 h-3.5" />
                        )}
                        <span className="font-mono">{parada.hora}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Key Points of Granada Markers */}
              {showPuntosClave && filteredPuntosClave.map((punto) => {
                const isSelected = inspectedPunto?.id === punto.id;

                return (
                  <AdvancedMarker
                    key={punto.id}
                    position={punto.coordenadas}
                    onClick={() => {
                      setInspectedPunto(punto);
                      setInspectedParada(null);
                      setCameraTarget(punto.coordenadas);
                    }}
                    title={punto.nombre}
                  >
                    <div className="cursor-pointer transform hover:scale-125 transition-transform">
                      <div className={`p-1.5 rounded-full shadow-md border-2 transition-all ${
                        isSelected
                          ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] border-white scale-110 ring-4 ring-amber-500/30'
                          : punto.barrio === 'Albaicín'
                          ? 'bg-sky-600 text-white border-white'
                          : punto.barrio === 'Sacromonte'
                          ? 'bg-emerald-600 text-white border-white'
                          : punto.barrio === 'Realejo'
                          ? 'bg-amber-700 text-white border-white'
                          : punto.barrio === 'Alhambra'
                          ? 'bg-red-700 text-white border-white'
                          : 'bg-indigo-600 text-white border-white'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        </div>

        {/* Legend bar over map */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl p-2.5 shadow-lg text-[11px] flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center gap-1.5 font-cinzel font-semibold text-[var(--text-primary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Leyenda:</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-1.5 rounded-full bg-amber-600" />
            <span className="text-[var(--text-secondary)]">Salida Templo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-1.5 rounded-full bg-purple-700" />
            <span className="text-[var(--text-secondary)]">Ganivet (C.O.)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-1.5 rounded-full bg-rose-700" />
            <span className="text-[var(--text-secondary)]">Catedral</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span className="text-[var(--text-secondary)]">Punto Clave</span>
          </div>
        </div>

        {/* Bottom Inspector Card (when marker is clicked) */}
        {(inspectedPunto || inspectedParada) && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-xl bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--accent-gold)] rounded-2xl p-4 shadow-xl z-10 transition-all animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--accent-gold)] font-bold border border-[var(--border-subtle)]">
                    {inspectedPunto ? `${inspectedPunto.barrio} · ${inspectedPunto.categoria}` : 'Hito de Itinerario'}
                  </span>
                  {inspectedParada && (
                    <span className="text-[11px] font-mono font-bold text-[var(--accent-gold)] bg-amber-500/10 px-2 py-0.5 rounded">
                      {inspectedParada.hora} h
                    </span>
                  )}
                </div>
                <h4 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
                  {inspectedPunto ? inspectedPunto.nombre : inspectedParada?.nombre}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-serif-book mt-1">
                  {inspectedPunto ? inspectedPunto.descripcion : inspectedParada?.descripcion}
                </p>
                {inspectedPunto && (
                  <p className="text-xs text-[var(--accent-gold)] font-serif-book italic mt-2 bg-[var(--bg-card-subtle)] p-2 rounded-lg border border-[var(--border-subtle)]">
                    <strong className="not-italic font-cinzel text-[10px] uppercase block text-[var(--text-primary)]">Consejo del Capataz:</strong>
                    {inspectedPunto.consejoCapataz}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setInspectedPunto(null);
                  setInspectedParada(null);
                }}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--text-muted)] font-serif-book">
                {inspectedPunto?.cofradias?.length ? `Pasan por aquí: ${inspectedPunto.cofradias.join(', ')}` : currentHermandad.nombre}
              </span>
              <button
                onClick={() => {
                  const subject = inspectedPunto ? inspectedPunto.nombre : `${currentHermandad.nombre} en ${inspectedParada?.nombre}`;
                  onAskCapataz(`Explícame la historia y el mejor consejo para ver ${subject}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-cinzel font-bold bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] hover:opacity-95 transition shrink-0"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Preguntar Capataz</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Itinerary Milestones Timeline Strip */}
      <div className="editorial-card rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold">
              Cronograma Oficial · {currentHermandad.dia}
            </span>
            <h4 className="font-cinzel text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Footprints className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>Itinerario de {currentHermandad.nombre}</span>
            </h4>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-serif-book italic">
            Sede: {currentHermandad.sede}
          </span>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {itinerarioData.paradas.map((parada, idx) => {
            const isSelected = inspectedParada?.nombre === parada.nombre;
            return (
              <div
                key={idx}
                onClick={() => {
                  setInspectedParada(parada);
                  setInspectedPunto(null);
                  setCameraTarget(parada.coordenadas);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-[var(--accent-gold)] ring-2 ring-amber-500/20'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-cinzel font-semibold uppercase text-[var(--text-muted)]">
                    {idx === 0 ? 'Paso 1: Salida' : idx === 1 ? 'Paso 2: C. Oficial' : idx === 2 ? 'Paso 3: Catedral' : 'Paso 4: Recogida'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--accent-gold)] tabular-nums">
                    {parada.hora}
                  </span>
                </div>
                <h5 className="font-cinzel text-xs font-bold text-[var(--text-primary)] truncate">
                  {parada.nombre}
                </h5>
                <p className="text-[11px] text-[var(--text-secondary)] font-serif-book line-clamp-1 mt-0.5">
                  {parada.descripcion}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary Route Description */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <p className="text-[var(--text-secondary)] font-serif-book">
            <strong className="text-[var(--text-primary)] font-cinzel">Recorrido: </strong>
            {currentHermandad.itinerarioResumido}
          </p>
          <button
            onClick={() => onAskCapataz(`Dame el itinerario calle por calle con tiempos de paso de ${currentHermandad.nombre} para el ${currentHermandad.dia}.`)}
            className="text-[var(--accent-gold)] font-cinzel font-bold hover:underline shrink-0 flex items-center gap-1"
          >
            <span>Ver callejero detallado</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
