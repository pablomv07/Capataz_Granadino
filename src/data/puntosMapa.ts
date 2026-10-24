export interface PuntoClaveGranada {
  id: string;
  nombre: string;
  barrio: 'Albaicín' | 'Sacromonte' | 'Realejo' | 'Centro' | 'Alhambra';
  cofradias: string[];
  descripcion: string;
  dificultadAcceso: 'Fácil' | 'Media' | 'Muy Alta (Aforo)';
  consejoCapataz: string;
  momentosEstrella: string[];
}

export const PUNTOS_CLAVE_GRANADA: PuntoClaveGranada[] = [
  {
    id: 'san-gregorio-grifos',
    nombre: 'Cuesta de San Gregorio y Grifos de San José',
    barrio: 'Albaicín',
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
    cofradias: ['Soledad de San Jerónimo (Viernes Santo)'],
    descripcion: 'El claustro y portada del monasterio renacentista donde reposan los restos del Gran Capitán.',
    dificultadAcceso: 'Fácil',
    consejoCapataz: 'Ideal para ver desfilar a los personajes bíblicos y escuchar a las Chías soplar las trompetas de hojalata.',
    momentosEstrella: [
      'La salida de la Soledad con la luz dorada de la tarde sobre la piedra del monasterio',
      'El toque lastimero de los tambores de las Chías resonando en la calle San Jerónimo',
    ],
  },
];
