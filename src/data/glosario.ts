export interface TerminoGlosario {
  termino: string;
  definicion: string;
  categoria: 'Paso y Cuadrilla' | 'Indumentaria' | 'Tradición Granadina' | 'Cortejo';
  ejemploGranada?: string;
}

export const GLOSARIO_GRANADINO: TerminoGlosario[] = [
  {
    termino: 'Capataz',
    definicion: 'Responsable máximo de mandar el paso y guiar a la cuadrilla de costaleros mediante toques de llamador y órdenes de viva voz.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'En Granada, dirigir palios como la Aurora por la Cuesta de San Gregorio exige pericia milimétrica.',
  },
  {
    termino: 'Costalero',
    definicion: 'Hermano que carga el peso del paso sobre la séptima vértebra cervical, acolchada con el costal y la morcilla.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'Las cuadrillas granadinas son reconocidas por su fuerza en las empinadas cuestas del Albayzín y Sacromonte.',
  },
  {
    termino: 'Llamador o Tarja',
    definicion: 'Pieza articulada de metal o bronce fijada en el frontal del paso que el capataz golpea para ordenar levantar o arriar el paso.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'El sonido seco del llamador silencia a la multitud antes de cada levantá.',
  },
  {
    termino: 'Chicotá',
    definicion: 'Trayecto continuo que recorre un paso desde que el capataz da la levantá hasta que se ordena arriar el paso al suelo.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'Una de las chicotás más famosas es la subida de los Grifos de San José de la Aurora sin descanso.',
  },
  {
    termino: 'El Greñúo',
    definicion: 'Sobrenombre popular y cariñoso que los granadinos dan a la imagen de Nuestro Padre Jesús del Rescate, por su frondosa y rizada melena de pelo natural.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'El Lunes Santo miles de personas abarrotan la calle Gracia para ver la salida del Señor de la Magdalena.',
  },
  {
    termino: 'Las Chías',
    definicion: 'Personajes únicos de la Semana Santa de Granada que anteceden a la Soledad de San Jerónimo el Viernes Santo, portando hábitos oscuros con cola y tocando trompetas y tambores de hojalata del siglo XVI.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'Originalmente anunciaban en la Inquisición a los reos de muerte; hoy son seña de identidad patrimonial.',
  },
  {
    termino: 'Carrera Oficial',
    definicion: 'Itinerario común de obligado paso para todas las hermandades de penitencia federadas en Granada.',
    categoria: 'Cortejo',
    ejemploGranada: 'Comienza en la calle Ángel Ganivet y culmina en la Santa Iglesia Catedral atravesando la Plaza de las Pasiegas.',
  },
  {
    termino: 'Tres de la Tarde en el Campo del Príncipe',
    definicion: 'Acto multitudinario de silencio y devoción el Viernes Santo a las 15:00 horas ante la cruz de alabastro del Cristo de los Favores en el barrio del Realejo.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'La tradición manda rezar un credo y pedir al Señor de los Favores tres gracias o favores.',
  },
  {
    termino: 'El Silencio (Paso de la Misericordia)',
    definicion: 'Paso de la Hermandad del Silencio en la noche del Jueves Santo, donde las farolas de las calles se apagan totalmente y solo se escucha el golpe sordo de un tambor enlutado.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'El paso por la Carrera del Darro a la luz de las velas con la silueta de la Alhambra es sobrecogedor.',
  },
  {
    termino: 'Paso de Palio',
    definicion: 'Paso procesional cubierto por un techo de palio bordado sostenido por varales de orfebrería, bajo el cual se venera a la Virgen Dolorosa.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'Palios como Nuestra Señora de la Victoria o Santa María de la Alhambra deslumbran por su orfebrería y caídas.',
  },
  {
    termino: 'Paso de Misterio',
    definicion: 'Paso de grandes dimensiones que escenifica plásticamente un episodio evangélico de la Pasión de Cristo con múltiples figuras secundarias.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'La Santa Cena del Realejo o el Sentencia de las Maravillas son grandes muestras de misterio granadino.',
  },
  {
    termino: 'El Facundillo',
    definicion: 'Procesión infantil que abre la mañana del Domingo de Resurrección, donde los niños del Realejo portan a hombros la talla del Dulce Nombre de Jesús.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'Cientos de niños tocan pequeñas campanitas de barro cocido típicas de la alfarería granadina.',
  },
  {
    termino: 'Saeta',
    definicion: 'Canto devoto y desgarrador de raíz flamenca que se interpreta a viva voz desde balcones o a ras de calle al paso de las imágenes.',
    categoria: 'Tradición Granadina',
    ejemploGranada: 'Inolvidables son las saetas cantadas al Cristo de los Gitanos desde las cuevas del Sacromonte.',
  },
  {
    termino: 'Bacalao (Guion Corporativo)',
    definicion: 'Estandarte bordado con el escudo de la hermandad que representa oficialmente a la cofradía, denominado popularmente así por su forma similar al pez.',
    categoria: 'Cortejo',
    ejemploGranada: 'Abre la comitiva de la presidencia oficial de la cofradía junto a las varas de gobierno.',
  },
  {
    termino: 'Levantá al cielo',
    definicion: 'Maniobra en la que los costaleros alzan el paso de un solo impulso firme hacia arriba con júbilo y gallardía tras el toque del llamador.',
    categoria: 'Paso y Cuadrilla',
    ejemploGranada: 'Dedicada frecuentemente a enfermos, hermanos difuntos o al pueblo de Granada.',
  },
];
