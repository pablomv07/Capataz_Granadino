export interface CofradeLatLng {
  lat: number;
  lng: number;
}

export interface PuntoInteresGranada {
  id: string;
  nombre: string;
  barrio: 'Albaicín' | 'Sacromonte' | 'Realejo' | 'Centro' | 'Alhambra';
  categoria: 'Monumento' | 'Estrechez' | 'Mirador' | 'Templo' | 'Paso Histórico';
  coordenadas: CofradeLatLng;
  cofradias: string[];
  descripcion: string;
  dificultadAcceso: 'Fácil' | 'Media' | 'Muy Alta (Aforo)';
  consejoCapataz: string;
  momentosEstrella: string[];
}

export interface ParadaItinerario {
  nombre: string;
  hora: string;
  tipo: 'salida' | 'hito' | 'carrera_oficial' | 'catedral' | 'regreso';
  coordenadas: CofradeLatLng;
  descripcion?: string;
}

export interface ItinerarioCofradiaMap {
  hermandadId: string;
  nombre: string;
  dia: string;
  barrio: string;
  color: string;
  colorContraste: string;
  sedeNombre: string;
  sedeCoordenadas: CofradeLatLng;
  paradas: ParadaItinerario[];
  rutaPolilinea: CofradeLatLng[];
}

// Carrera Oficial coordinates (Ganivet -> Plaza del Carmen -> Pasiegas -> Catedral -> Puerta del Perdón)
export const CARRERA_OFICIAL_PUNTOS: CofradeLatLng[] = [
  { lat: 37.1729, lng: -3.5982 }, // Ganivet (Palco Presidencial)
  { lat: 37.1742, lng: -3.5984 }, // Plaza del Carmen (Ayuntamiento)
  { lat: 37.1752, lng: -3.5988 }, // Mesones / Marques de Gerona
  { lat: 37.1763, lng: -3.5992 }, // Plaza de las Pasiegas
  { lat: 37.1765, lng: -3.5990 }, // Entrada Catedral de Granada
  { lat: 37.1768, lng: -3.5987 }, // Salida Puerta del Perdón
];

export const PUNTOS_CLAVE_MAPA: PuntoInteresGranada[] = [
  {
    id: 'san-gregorio-grifos',
    nombre: 'Cuesta de San Gregorio y Grifos de San José',
    barrio: 'Albaicín',
    categoria: 'Estrechez',
    coordenadas: { lat: 37.1782, lng: -3.5954 },
    cofradias: ['La Aurora (Jueves Santo)', 'El Vía Crucis (Martes Santo)'],
    descripcion: 'Paso de estrechez milimétrica donde los costaleros rozan las paredes encaladas y balcones floridos.',
    dificultadAcceso: 'Muy Alta (Aforo)',
    consejoCapataz: 'Coger sitio al menos 2 horas antes de la llegada del palio. Llevar calzado con agarre para el empedrado en cuesta.',
    momentosEstrella: [
      'Subida de madrugada de María Santísima de la Aurora Coronada',
      'Maniobra al milímetro en la esquina de los Grifos de San José',
    ],
  },
  {
    id: 'carrera-darro',
    nombre: 'Carrera del Darro y Paseo de los Tristes',
    barrio: 'Albaicín',
    categoria: 'Paso Histórico',
    coordenadas: { lat: 37.1788, lng: -3.5916 },
    cofradias: ['El Silencio (Jueves noche)', 'Las Maravillas (Domingo)', 'Los Dolores (Lunes)', 'La Esperanza (Martes)'],
    descripcion: 'El cauce del río Darro con los puentes de piedra y las murallas iluminadas de la Alhambra alzándose enfrente.',
    dificultadAcceso: 'Media',
    consejoCapataz: 'Situarse cerca del Puente del Cadí o de San Pedro y San Pablo para ver el contraste entre la cera y la Alhambra.',
    momentosEstrella: [
      'Paso en tinieblas de El Silencio al son del tambor ronco',
      'El misterio de la Sentencia (Maravillas) cruzando el Darro al atardecer',
    ],
  },
  {
    id: 'sacromonte-chapiz',
    nombre: 'Cuesta del Chapiz y Camino del Sacromonte',
    barrio: 'Sacromonte',
    categoria: 'Paso Histórico',
    coordenadas: { lat: 37.1825, lng: -3.5878 },
    cofradias: ['Los Gitanos (Miércoles Santo)'],
    descripcion: 'Camino ascendente entre chumberas, pitas y cuevas gitanas en dirección a la Abadía del Sacromonte.',
    dificultadAcceso: 'Muy Alta (Aforo)',
    consejoCapataz: 'Subir con tiempo antes de que corten el acceso de vehículos. La madrugada es fría, llevar abrigo y calzado adecuado.',
    momentosEstrella: [
      'Encendido de hogueras de romero y saetas espontáneas desde las cuevas',
      'Entrada triunfal al amanecer en la Abadía del Sacromonte',
    ],
  },
  {
    id: 'campo-principe',
    nombre: 'Campo del Príncipe y Cristo de los Favores',
    barrio: 'Realejo',
    categoria: 'Monumento',
    coordenadas: { lat: 37.1712, lng: -3.5938 },
    cofradias: ['Soledad y Favores (Viernes Santo)', 'La Cañilla (Martes)', 'Santa Cena (Domingo)'],
    descripcion: 'Plaza histórica del Realejo presidida por la cruz de piedra del Cristo de los Favores (1640).',
    dificultadAcceso: 'Media',
    consejoCapataz: 'El Viernes Santo a las 14:00 h ya hay miles de devotos esperando el rezo de las tres de la tarde. Guardar absoluto silencio a las 15:00 h.',
    momentosEstrella: [
      'Las tres de la tarde del Viernes Santo: silencio, toques de corneta y petición de tres deseos',
      'Descenso y ascenso de la cofradía de los Favores por la Cuesta de San Cecilio',
    ],
  },
  {
    id: 'pasiegas-catedral',
    nombre: 'Plaza de las Pasiegas y Puerta del Perdón',
    barrio: 'Centro',
    categoria: 'Monumento',
    coordenadas: { lat: 37.1763, lng: -3.5992 },
    cofradias: ['Las 32 cofradías federadas'],
    descripcion: 'La grandiosa fachada barroca de la Catedral de Alonso Cano enmarca la entrada y salida de cada cofradía.',
    dificultadAcceso: 'Fácil',
    consejoCapataz: 'La rampa de las Pasiegas permite contemplar la levantá de los pasos mirando hacia la portada principal.',
    momentosEstrella: [
      'El giro de 180 grados de los pasos frente a la fachada catedralicia',
      'La salida solemne por la renacentista Puerta del Perdón hacia Cárcel Baja',
    ],
  },
  {
    id: 'alhambra-justicia',
    nombre: 'Puerta de la Justicia y Cuesta de Gomérez',
    barrio: 'Alhambra',
    categoria: 'Paso Histórico',
    coordenadas: { lat: 37.1766, lng: -3.5888 },
    cofradias: ['Santa María de la Alhambra (Sábado Santo)'],
    descripcion: 'La bajada por la Puerta de la Justicia y el bosque de la Alhambra entre álamos y fuentes susurrantes.',
    dificultadAcceso: 'Media',
    consejoCapataz: 'Ver la bajada a las 17:30 h con la luz del atardecer filtrándose por las copas de los árboles del bosque nazarí.',
    momentosEstrella: [
      'El paso de orfebrería que recrea el Patio de los Leones cruzando el arco de herradura de la Puerta de la Justicia',
      'El descenso por la Cuesta de Gomérez hasta desembocar en Plaza Nueva',
    ],
  },
  {
    id: 'puente-romano-genil',
    nombre: 'Puente Romano sobre el río Genil',
    barrio: 'Centro',
    categoria: 'Paso Histórico',
    coordenadas: { lat: 37.1678, lng: -3.5958 },
    cofradias: ['El Trabajo (Lunes)', 'La Lanzada (Martes)', 'Salesianos (Jueves)', 'Escolapios (Viernes)'],
    descripcion: 'Punto de cruce monumental que conecta el barrio del Zaidín con el centro histórico de Granada.',
    dificultadAcceso: 'Fácil',
    consejoCapataz: 'Excelente punto para familias con niños gracias a la amplitud de la Carrera de la Virgen y el Paseo del Salón.',
    momentosEstrella: [
      'El paso de regreso de los Escolapios con bengalas moradas sobre el río Genil',
      'El cruce vespertino del Trabajo con marchas clásicas acompasadas',
    ],
  },
  {
    id: 'san-jeronimo-compas',
    nombre: 'Compás del Monasterio de San Jerónimo',
    barrio: 'Centro',
    categoria: 'Templo',
    coordenadas: { lat: 37.1809, lng: -3.6041 },
    cofradias: ['Soledad de San Jerónimo (Viernes Santo)'],
    descripcion: 'El claustro y portada del monasterio renacentista donde reposan los restos del Gran Capitán.',
    dificultadAcceso: 'Fácil',
    consejoCapataz: 'Ideal para ver desfilar a los personajes bíblicos y escuchar a las Chías soplar las trompetas de hojalata.',
    momentosEstrella: [
      'La salida de la Soledad con la luz dorada de la tarde sobre la piedra del monasterio',
      'El toque lastimero de los tambores de las Chías resonando en la calle San Jerónimo',
    ],
  },
  {
    id: 'arco-elvira',
    nombre: 'Arco de Elvira',
    barrio: 'Albaicín',
    categoria: 'Monumento',
    coordenadas: { lat: 37.1827, lng: -3.5996 },
    cofradias: ['La Estrella (Jueves Santo)'],
    descripcion: 'Milenaria puerta califal de entrada al Albaicín, punto de paso solemne de la Virgen de la Estrella.',
    dificultadAcceso: 'Media',
    consejoCapataz: 'Gran concentración de público al regreso de la Estrella cruzando el arco.',
    momentosEstrella: ['Paso bajo el arco de herradura morisco con lluvia de pétalos'],
  },
  {
    id: 'mirador-san-nicolas',
    nombre: 'Mirador de San Nicolás & San Cristóbal',
    barrio: 'Albaicín',
    categoria: 'Mirador',
    coordenadas: { lat: 37.1812, lng: -3.5927 },
    cofradias: ['La Aurora', 'La Estrella', 'El Huerto'],
    descripcion: 'Las vistas más icónicas del mundo a la Alhambra con el paso de las cofradías del alto Albaicín.',
    dificultadAcceso: 'Muy Alta (Aforo)',
    consejoCapataz: 'Subir antes del ocaso para conseguir un ángulo despejado.',
    momentosEstrella: ['La silueta de los pasos recortada contra la silueta iluminada de la Alhambra'],
  },
  {
    id: 'plaza-nueva-santa-ana',
    nombre: 'Plaza Nueva & San Gil y Santa Ana',
    barrio: 'Centro',
    categoria: 'Templo',
    coordenadas: { lat: 37.1771, lng: -3.5949 },
    cofradias: ['La Esperanza', 'El Silencio', 'Los Gitanos', 'Las Maravillas', 'El Sepulcro'],
    descripcion: 'El epicentro donde confluyen el Albaicín, la Alhambra y el centro urbano de Granada.',
    dificultadAcceso: 'Media',
    consejoCapataz: 'Ubicarse en los soportales de Santa Ana o en el pretil del río.',
    momentosEstrella: ['El desfile procesional girando hacia Plaza Nueva al anochecer'],
  },
  {
    id: 'colegiata-salvador',
    nombre: 'Colegiata del Salvador (Plaza del Salvador)',
    barrio: 'Albaicín',
    categoria: 'Templo',
    coordenadas: { lat: 37.1828, lng: -3.5908 },
    cofradias: ['La Estrella (Jueves)', 'La Borriquilla (Domingo)'],
    descripcion: 'Epicentro vecinal del Albaicín donde se vive la pasión cofrade con devoción pura de barrio.',
    dificultadAcceso: 'Media',
    consejoCapataz: 'La recogida de la Estrella en la madrugada del Viernes Santo es una explosión de fe y saetas.',
    momentosEstrella: ['El regreso a la Colegiata tras remontar las cuestas del Albaicín'],
  }
];

// Dictionary of temple coordinates for each brotherhood sede
export const TEMPLOS_COFRADIAS: Record<string, { nombre: string; barrio: string; coords: CofradeLatLng }> = {
  'borriquilla': { nombre: 'Parroquia de San Andrés (Salida San Justo)', barrio: 'Centro', coords: { lat: 37.1792, lng: -3.6015 } },
  'santa-cena': { nombre: 'Iglesia de Santo Domingo', barrio: 'Realejo', coords: { lat: 37.1715, lng: -3.5925 } },
  'maravillas': { nombre: 'Parroquia de San Pedro y San Pablo', barrio: 'Albaicín', coords: { lat: 37.1788, lng: -3.5916 } },
  'despojado': { nombre: 'Parroquia de San Emilio', barrio: 'Figares', coords: { lat: 37.1685, lng: -3.6045 } },
  'cautivo': { nombre: 'Monasterio de la Encarnación', barrio: 'Centro', coords: { lat: 37.1772, lng: -3.6022 } },
  'trabajo': { nombre: 'Iglesia del Corpus Christi', barrio: 'Zaidín', coords: { lat: 37.1565, lng: -3.5978 } },
  'dolores': { nombre: 'Parroquia de San Pedro y San Pablo', barrio: 'Albaicín', coords: { lat: 37.1788, lng: -3.5916 } },
  'rescate': { nombre: 'Parroquia de Santa María Magdalena', barrio: 'Centro', coords: { lat: 37.1748, lng: -3.6033 } },
  'huerto': { nombre: 'Convento de las Madres Comendadoras de Santiago', barrio: 'Realejo', coords: { lat: 37.1706, lng: -3.5931 } },
  'san-agustin': { nombre: 'Convento del Santo Ángel Custodio', barrio: 'Centro', coords: { lat: 37.1755, lng: -3.6008 } },
  'via-crucis': { nombre: 'Parroquia de San Juan de los Reyes', barrio: 'Albaicín', coords: { lat: 37.1800, lng: -3.5935 } },
  'lanzada': { nombre: 'Parroquia de Ntra. Sra. de los Dolores', barrio: 'Zaidín', coords: { lat: 37.1588, lng: -3.5952 } },
  'esperanza': { nombre: 'Iglesia de San Gil y Santa Ana', barrio: 'Centro', coords: { lat: 37.1771, lng: -3.5949 } },
  'canilla': { nombre: 'Iglesia de Santo Domingo', barrio: 'Realejo', coords: { lat: 37.1715, lng: -3.5925 } },
  'gitanos': { nombre: 'Abadía del Sacromonte', barrio: 'Sacromonte', coords: { lat: 37.1822, lng: -3.5786 } },
  'estudiantes': { nombre: 'Parroquia de San Justo y Pastor', barrio: 'Centro', coords: { lat: 37.1792, lng: -3.6015 } },
  'paciencia-penas': { nombre: 'Iglesia Imperial de San Matías', barrio: 'Centro', coords: { lat: 37.1738, lng: -3.5969 } },
  'rosario': { nombre: 'Iglesia de Santo Domingo', barrio: 'Realejo', coords: { lat: 37.1715, lng: -3.5925 } },
  'nazareno': { nombre: 'Convento de las Carmelitas Descalzas', barrio: 'Realejo', coords: { lat: 37.1728, lng: -3.5958 } },
  'aurora': { nombre: 'Iglesia de Santa María de la Aurora y San Miguel Bajo', barrio: 'Albaicín', coords: { lat: 37.1804, lng: -3.5942 } },
  'estrella': { nombre: 'Iglesia de San Cristóbal / El Salvador', barrio: 'Albaicín', coords: { lat: 37.1828, lng: -3.5908 } },
  'silencio': { nombre: 'Parroquia de San Pedro y San Pablo', barrio: 'Albaicín', coords: { lat: 37.1788, lng: -3.5916 } },
  'concepcion': { nombre: 'Monasterio de la Concepción', barrio: 'Albaicín', coords: { lat: 37.1795, lng: -3.5930 } },
  'salesianos': { nombre: 'Santuario de María Auxiliadora', barrio: 'Zaidín', coords: { lat: 37.1580, lng: -3.5990 } },
  'ferroviarios': { nombre: 'Parroquia de San Juan de Letrán', barrio: 'Centro', coords: { lat: 37.1852, lng: -3.6035 } },
  'favores': { nombre: 'Parroquia de San Cecilio', barrio: 'Realejo', coords: { lat: 37.1702, lng: -3.5928 } },
  'escolapios': { nombre: 'Parroquia de San José de Calasanz', barrio: 'Genil', coords: { lat: 37.1662, lng: -3.5938 } },
  'soledad-san-jeronimo': { nombre: 'Monasterio de San Jerónimo', barrio: 'Centro', coords: { lat: 37.1809, lng: -3.6041 } },
  'santo-sepulcro': { nombre: 'Parroquia de San Gil y Santa Ana', barrio: 'Centro', coords: { lat: 37.1771, lng: -3.5949 } },
  'alhambra': { nombre: 'Iglesia de Santa María de la Alhambra', barrio: 'Alhambra', coords: { lat: 37.1766, lng: -3.5888 } },
  'resurreccion': { nombre: 'Parroquia de San Miguel Arcángel', barrio: 'Zaidín', coords: { lat: 37.1601, lng: -3.5998 } },
  'resucitado': { nombre: 'Iglesia del Sagrario (Catedral)', barrio: 'Centro', coords: { lat: 37.1761, lng: -3.5996 } },
};

/**
 * Builds a realistic polyline and milestone stops for a given brotherhood
 */
export function getItinerarioMapData(hermandadId: string, hermandadMeta?: {
  nombre: string;
  dia: string;
  salida: string;
  carreraOficial: string;
  catedral: string;
  regreso: string;
}): ItinerarioCofradiaMap {
  const templo = TEMPLOS_COFRADIAS[hermandadId] || {
    nombre: 'Sede Canónica',
    barrio: 'Granada',
    coords: { lat: 37.1773, lng: -3.5986 },
  };

  const ganivet = { lat: 37.1729, lng: -3.5982 };
  const pasiegas = { lat: 37.1763, lng: -3.5992 };
  const puertaPerdon = { lat: 37.1768, lng: -3.5987 };

  // Intermediate points based on brotherhood territory
  let idaIntermedios: CofradeLatLng[] = [];
  let vueltaIntermedios: CofradeLatLng[] = [];
  let color = '#B45309'; // warm amber gold default

  if (hermandadId === 'gitanos') {
    color = '#831843'; // purple wine
    idaIntermedios = [
      { lat: 37.1822, lng: -3.5786 }, // Abadía
      { lat: 37.1825, lng: -3.5878 }, // Cuesta del Chapiz
      { lat: 37.1798, lng: -3.5891 }, // Paseo de los Tristes
      { lat: 37.1788, lng: -3.5916 }, // Carrera del Darro
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1745, lng: -3.5975 }, // Reyes Católicos
    ];
    vueltaIntermedios = [
      { lat: 37.1768, lng: -3.5987 }, // Puerta del Perdón
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1788, lng: -3.5916 }, // Carrera del Darro
      { lat: 37.1825, lng: -3.5878 }, // Cuesta del Chapiz
      { lat: 37.1822, lng: -3.5786 }, // Subida Abadía con hogueras
    ];
  } else if (hermandadId === 'silencio') {
    color = '#0F172A'; // obsidian black
    idaIntermedios = [
      { lat: 37.1788, lng: -3.5916 }, // San Pedro
      { lat: 37.1778, lng: -3.5940 }, // Carrera del Darro
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1745, lng: -3.5975 }, // Reyes Católicos
    ];
    vueltaIntermedios = [
      { lat: 37.1768, lng: -3.5987 }, // Puerta del Perdón
      { lat: 37.1772, lng: -3.5970 }, // Gran Vía
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1788, lng: -3.5916 }, // San Pedro en tinieblas
    ];
  } else if (hermandadId === 'aurora') {
    color = '#1D4ED8'; // deep celestial blue
    idaIntermedios = [
      { lat: 37.1804, lng: -3.5942 }, // San Miguel Bajo
      { lat: 37.1782, lng: -3.5954 }, // Cuesta San Gregorio
      { lat: 37.1775, lng: -3.5965 }, // Calderería Nueva
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1745, lng: -3.5975 }, // Reyes Católicos
    ];
    vueltaIntermedios = [
      { lat: 37.1768, lng: -3.5987 }, // Puerta del Perdón
      { lat: 37.1775, lng: -3.5965 }, // Cárcel Baja / Calderería
      { lat: 37.1782, lng: -3.5954 }, // Subida de los Grifos
      { lat: 37.1804, lng: -3.5942 }, // San Miguel Bajo de madrugada
    ];
  } else if (hermandadId === 'alhambra') {
    color = '#991B1B'; // nazarí crimson
    idaIntermedios = [
      { lat: 37.1766, lng: -3.5888 }, // Iglesia Alhambra
      { lat: 37.1761, lng: -3.5902 }, // Puerta de la Justicia
      { lat: 37.1755, lng: -3.5925 }, // Bosque de la Alhambra
      { lat: 37.1760, lng: -3.5945 }, // Cuesta de Gomérez
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
    ];
    vueltaIntermedios = [
      { lat: 37.1768, lng: -3.5987 }, // Puerta del Perdón
      { lat: 37.1768, lng: -3.5960 }, // Plaza Nueva
      { lat: 37.1760, lng: -3.5945 }, // Puerta de las Granadas
      { lat: 37.1766, lng: -3.5888 }, // Subida a la Alhambra
    ];
  } else if (hermandadId === 'favores') {
    color = '#78350F'; // bronze penitent
    idaIntermedios = [
      { lat: 37.1702, lng: -3.5928 }, // San Cecilio
      { lat: 37.1712, lng: -3.5938 }, // Campo del Príncipe
      { lat: 37.1715, lng: -3.5925 }, // Santo Domingo
      { lat: 37.1720, lng: -3.5950 }, // San Matías
    ];
    vueltaIntermedios = [
      { lat: 37.1768, lng: -3.5987 }, // Puerta del Perdón
      { lat: 37.1740, lng: -3.5970 }, // San Matías
      { lat: 37.1712, lng: -3.5938 }, // Campo del Príncipe al anochecer
      { lat: 37.1702, lng: -3.5928 }, // San Cecilio
    ];
  } else if (templo.barrio === 'Zaidín' || hermandadId === 'trabajo' || hermandadId === 'lanzada' || hermandadId === 'salesianos') {
    color = '#4338CA'; // royal indigo
    idaIntermedios = [
      templo.coords,
      { lat: 37.1650, lng: -3.5965 }, // Avenida Dílar / Zaidín
      { lat: 37.1678, lng: -3.5958 }, // Puente Romano del Genil
      { lat: 37.1700, lng: -3.5960 }, // Carrera de la Virgen
    ];
    vueltaIntermedios = [
      puertaPerdon,
      { lat: 37.1730, lng: -3.5970 }, // Alhóndiga
      { lat: 37.1700, lng: -3.5960 }, // Carrera de la Virgen
      { lat: 37.1678, lng: -3.5958 }, // Cruce de regreso sobre el Genil
      templo.coords,
    ];
  } else {
    // Default pleasant cofrade route
    idaIntermedios = [
      templo.coords,
      { lat: (templo.coords.lat + ganivet.lat) / 2, lng: (templo.coords.lng + ganivet.lng) / 2 },
    ];
    vueltaIntermedios = [
      puertaPerdon,
      { lat: (puertaPerdon.lat + templo.coords.lat) / 2, lng: (puertaPerdon.lng + templo.coords.lng) / 2 },
      templo.coords,
    ];
  }

  // Assemble full polyline
  const rutaPolilinea: CofradeLatLng[] = [
    ...idaIntermedios,
    ganivet,
    ...CARRERA_OFICIAL_PUNTOS.slice(1),
    ...vueltaIntermedios,
  ];

  const paradas: ParadaItinerario[] = [
    {
      nombre: `Salida: ${templo.nombre}`,
      hora: hermandadMeta?.salida || '17:00',
      tipo: 'salida',
      coordenadas: templo.coords,
      descripcion: `Comienzo de la estación de penitencia desde ${templo.barrio}.`,
    },
    {
      nombre: 'Ganivet (Inicio Carrera Oficial)',
      hora: hermandadMeta?.carreraOficial || '19:30',
      tipo: 'carrera_oficial',
      coordenadas: ganivet,
      descripcion: 'Entrada oficial en el palco presidencial de Ángel Ganivet.',
    },
    {
      nombre: 'Santa Iglesia Catedral (Plaza de las Pasiegas)',
      hora: hermandadMeta?.catedral || '20:45',
      tipo: 'catedral',
      coordenadas: pasiegas,
      descripcion: 'Estación de Penitencia en las naves catedralicias y salida por la Puerta del Perdón.',
    },
    {
      nombre: `Regreso a ${templo.nombre}`,
      hora: hermandadMeta?.regreso || '23:30',
      tipo: 'regreso',
      coordenadas: templo.coords,
      descripcion: 'Recogida solemne en su templo de origen.',
    },
  ];

  return {
    hermandadId,
    nombre: hermandadMeta?.nombre || templo.nombre,
    dia: hermandadMeta?.dia || 'Semana Santa',
    barrio: templo.barrio,
    color,
    colorContraste: '#FFFFFF',
    sedeNombre: templo.nombre,
    sedeCoordenadas: templo.coords,
    paradas,
    rutaPolilinea,
  };
}
