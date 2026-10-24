export interface QuizQuestion {
  id: number;
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export const PREGUNTAS_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    pregunta: '¿Qué hermandad sube de madrugada entre hogueras de romero y saetas flamencas por el Sacromonte?',
    opciones: [
      'Los Estudiantes',
      'El Silencio',
      'Los Gitanos (Cristo del Consuelo)',
      'La Lanzada',
    ],
    correcta: 2,
    explicacion: '¡Exacto! El Miércoles Santo, el Cristo de los Gitanos regresa a la Abadía del Sacromonte entre candelas y cantes en las cuevas.',
  },
  {
    id: 2,
    pregunta: '¿A qué hora y en qué plaza se congrega Granada el Viernes Santo ante el Cristo de los Favores?',
    opciones: [
      'A las 12:00 en Plaza Nueva',
      'A las 15:00 en el Campo del Príncipe',
      'A las 18:00 en la Plaza de las Pasiegas',
      'A las 20:00 en San Jerónimo',
    ],
    correcta: 1,
    explicacion: '¡A esta es! A las tres de la tarde en el Campo del Príncipe se guarda silencio absoluto y se piden los tres favores.',
  },
  {
    id: 3,
    pregunta: '¿Qué apodo popular recibe Nuestro Padre Jesús del Rescate en la Iglesia de Santa María Magdalena?',
    opciones: [
      'El Señor de Granada',
      'El Moreno del Zaidín',
      'El Greñúo',
      'El Cautivo',
    ],
    correcta: 2,
    explicacion: '¡Correcto! "El Greñúo" se le llama por su abundante y rizada cabellera natural. Procesiona cada Lunes Santo.',
  },
  {
    id: 4,
    pregunta: '¿Qué singular cortejo de personajes con hopas negras y trompetas de hojalata abre el paso de la Soledad de San Jerónimo?',
    opciones: [
      'Las Chías',
      'Los Alfareros',
      'Los Sayones',
      'Los Turutas',
    ],
    correcta: 0,
    explicacion: '¡Bien visto! Las Chías son exclusivas de Granada, vestigio de los heraldos de la Inquisición que preceden a las figuras bíblicas.',
  },
  {
    id: 5,
    pregunta: '¿Qué cofradía del Sábado Santo desciende por la Puerta de la Justicia y el bosque de la Alhambra?',
    opciones: [
      'La Aurora',
      'Santa María de la Alhambra',
      'Las Penas',
      'Santo Entierro',
    ],
    correcta: 1,
    explicacion: '¡Acertaste! Su paso procesional es una joya de orfebrería que recrea el Patio de los Leones de la Alhambra.',
  },
  {
    id: 6,
    pregunta: '¿Qué caracteriza la estación de penitencia de El Silencio en la noche del Jueves Santo?',
    opciones: [
      'Lleva tres bandas de cornetas',
      'Se apaga el alumbrado público y solo suena un tambor con sordina',
      'Solo procesionan mujeres',
      'Va en carrera rápida sin paradas',
    ],
    correcta: 1,
    explicacion: '¡Así es! Las farolas del Paseo de los Tristes y Carrera del Darro se apagan y reina una sobrecogedora oscuridad.',
  },
  {
    id: 7,
    pregunta: '¿Qué calle histórica marca el inicio obligatorio de la Carrera Oficial de Granada?',
    opciones: [
      'Calle Mesones',
      'Gran Vía de Colón',
      'Calle Ángel Ganivet',
      'Cuesta de Gomérez',
    ],
    correcta: 2,
    explicacion: '¡Correcto! Ángel Ganivet es el punto donde se ubica la Tribuna Oficial y arranca el recorrido común.',
  },
  {
    id: 8,
    pregunta: '¿Qué procesión infantil protagoniza la mañana del Domingo de Resurrección con campanillas de barro?',
    opciones: [
      'La Borriquilla',
      'El Facundillo (Dulce Nombre de Jesús)',
      'Los Seises',
      'El Niño de la Chana',
    ],
    correcta: 1,
    explicacion: '¡Al cielo con él! El Facundillo sale de Santo Domingo portado por los niños del Realejo con miles de campanitas sonando.',
  },
];
