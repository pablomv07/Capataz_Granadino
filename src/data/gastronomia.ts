export interface PlatoTradicional {
  nombre: string;
  tipo: 'Dulce Cuaresmal' | 'Plato de Cuchara' | 'Tapa Tradicional';
  descripcion: string;
  origenGranadino: string;
  dondeProbarlo: string;
}

export interface TabernaCofrade {
  nombre: string;
  zona: string;
  especialidad: string;
  ambiente: string;
  consejo: string;
}

export const PLATOS_CUARESMA: PlatoTradicional[] = [
  {
    nombre: 'Torrijas granadinas con miel de la Alpujarra',
    tipo: 'Dulce Cuaresmal',
    descripcion: 'Rebanadas de pan de hogaza empapadas en leche aromatizada con canela y corteza de limón, fritas en aceite de oliva virgen extra y bañadas en miel pura de castaño o milflores de la Alpujarra.',
    origenGranadino: 'Receta conventual de los monasterios de clausura de Granada (Santa Paula y la Concepción).',
    dondeProbarlo: 'Pastelería Casa Pasteles (Albaicín y Plaza Larga) y López-Mezquita (calle Reyes Católicos).',
  },
  {
    nombre: 'Roscos de Semana Santa al anís',
    tipo: 'Dulce Cuaresmal',
    descripcion: 'Rosquillas crujientes aromatizadas con matalahúva (anís verde) y ralladura de naranja, rebozadas en azúcar y canela molida.',
    origenGranadino: 'Dulce típico de las casas cofrades que se prepara en familia durante la Cuaresma.',
    dondeProbarlo: 'Hornos tradicionales del Realejo y obradores del Albaicín.',
  },
  {
    nombre: 'Potaje de Vigilia con garbanzos y bacalao',
    tipo: 'Plato de Cuchara',
    descripcion: 'Guiso reposado de garbanzos con espinacas frescas, lomos de bacalao desalado y huevos duros, ligado con un sofrito de pimentón de la Vera y comino.',
    origenGranadino: 'El plato tradicional de los viernes de Cuaresma para respetar el precepto de abstinencia de carne.',
    dondeProbarlo: 'Tabernas tradicionales del Campo del Príncipe y mesones del centro histórico.',
  },
  {
    nombre: 'Habas con jamón de Trevélez',
    tipo: 'Tapa Tradicional',
    descripcion: 'Habas tiernas de la vega granadina estofadas lentamente en aceite de oliva y rematadas con taquitos de jamón curado al aire frío de Sierra Nevada.',
    origenGranadino: 'Orgullo de la huerta granadina en primavera que coincide exactamente con los días de Pasión.',
    dondeProbarlo: 'Bodegas Castañeda y tabernas de la calle Navas.',
  },
  {
    nombre: 'Pescaito frito y tortillitas de camarones',
    tipo: 'Tapa Tradicional',
    descripcion: 'Cazón en adobo, boquerones de la costa tropical granadina (Motril) y calamares fritos en harina limpia a fuego vivo.',
    origenGranadino: 'La tapa reina durante las esperas entre cortejos cofrades.',
    dondeProbarlo: 'Bar Los Diamantes (calle Navas) y Bar Oliver (Plaza del Pescado).',
  },
];

export const TABERNAS_COFRADES: TabernaCofrade[] = [
  {
    nombre: 'Bodegas Castañeda',
    zona: 'Centro / Plaza Nueva',
    especialidad: 'Vermut de barril, tabla caliente y montaditos',
    ambiente: 'Punto de encuentro histórico de nazarenos, costaleros y capataces.',
    consejo: 'Excelente para tomar algo rápido antes del paso de las cofradías por Plaza Nueva.',
  },
  {
    nombre: 'Taberna El Realejo',
    zona: 'Realejo / Campo del Príncipe',
    especialidad: 'Potajes del día, habas con jamón y vino de la tierra',
    ambiente: 'Lleno de fotos históricas del Señor de los Favores y la Santa Cena.',
    consejo: 'Ideal para comer el Viernes Santo antes del rezo de las tres de la tarde.',
  },
  {
    nombre: 'Bar Aliatar (Los Caracoles)',
    zona: 'Albaicín / Plaza Larga',
    especialidad: 'Caracoles en salsa picante, embutidos y ensaladilla',
    ambiente: 'El corazón castizo del Albaicín con el paso de la Aurora y la Estrella cerca.',
    consejo: 'Hacer parada antes de la subida nocturna de las cofradías albaicineras.',
  },
  {
    nombre: 'Chikito',
    zona: 'Plaza del Campillo / Puerta Real',
    especialidad: 'Cocina andaluza nazarí de alta calidad',
    ambiente: 'Histórico rincón literario de Federico García Lorca (El Rinconcillo).',
    consejo: 'Perfecto para una cena reposada tras ver pasar la Carrera Oficial por Ganivet.',
  },
];
