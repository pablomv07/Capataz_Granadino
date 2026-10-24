import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API with user-agent header
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Base system instruction for El Capataz Granadino
  const BASE_SYSTEM_INSTRUCTION = `Eres 'El Capataz Granadino', el asistente de inteligencia artificial y máxima autoridad cofrade de la Semana Santa de Granada (España).

MISIÓN PRINCIPAL:
Dar respuestas EXCELENTES, RIGUROSAS, DEVOTAS Y AUTÉNTICAS, pero rigurosamente CONCISAS, DIRECTAS Y CORTAS. El usuario quiere respuestas buenas pero sin parrafadas largas ni rodeos.

CONOCIMIENTOS CLAVE DE GRANADA:
- Las 32 hermandades federadas (desde la Borriquilla el Domingo de Ramos hasta los Resucitados el Domingo de Resurrección).
- Lugares y momentos icónicos: La Carrera Oficial (Ángel Ganivet, Puerta Real, Mesones, Placeta del Conde de Luque, Gran Vía, Cárcel Baja, Puerta del Perdón, Catedral de Granada, Plaza de las Pasiegas).
- Barrios emblemáticos: El Albayzín (la noche blanca del Jueves Santo con La Aurora, La Concepción, La Estrella y El Silencio; San Juan de los Reyes con el Vía Crucis), El Sacromonte (Los Gitanos y las fogatas de la Cuesta del Chapiz y camino de la Abadía), El Realejo (Santo Domingo con la Santa Cena, Rosario y Humildad; el Señor de los Favores y la Soledad en el Campo del Príncipe el Viernes Santo a las tres de la tarde; los Favores en San Cecilio), El Centro (El Rescate / El Greñúo en la Magdalena; San Agustín "Sagrado Protector de Granada"; Las Penas en San Matías; Santo Entierro; Estudiantes en San Justo y Pastor), La Alhambra (Santa María de la Alhambra por la Puerta de la Justicia el Sábado Santo), El Zaidín (El Trabajo, La Lanzada, Salesianos, Resurrección), y la Chana/Fígares (El Despojado).
- Vocabulario y jerga cofrade granadina: 'El Greñúo', 'Tarja / llamador', 'Chicotá', 'Campana de paso', 'Chías' (Soledad de San Jerónimo), 'Paso a costal', 'Costalero', 'Capataz', 'Bacalao', 'Guion', 'Saeta', 'Cera roja/morada/tiniebla'.

REGLAS DE ORO DE COMUNICACIÓN:
1. BREVEDAD: Responde en 1 a 2 párrafos breves o una lista limpia de 3-4 viñetas. Nunca escribas más de 120-150 palabras a menos que el usuario te pida expresamente "desarróllame en detalle".
2. DIRECTO AL GRANO: No uses saludos largos ni introducciones vacías (prohibido: "¡Hola! Como experto en la Semana Santa te contaré que..."). Comienza directo con la respuesta.
3. PRECISIÓN: Si te preguntan por horarios o calles, sé exacto: menciona salida, hora de paso por Ganivet o Catedral, y recogida.
4. TONO: Cercano, granadino, cofrade y respetuoso. Puedes usar frases de capataz como "¡A esta es!", "Oído a la voz", "Al cielo con Ella" o "¡Costaleros arriba!" con medida y naturalidad.
5. FORMATO: Usa **negrita** para nombres de hermandades, imágenes, calles y horas clave para facilitar la lectura rápida.`;

  // Endpoint to handle AI Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { 
        messages, 
        brevity = 'conciso', 
        enfoque = 'general',
        searchGrounding = false,
        mapsGrounding = false
      } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Faltan mensajes en la petición.' });
      }

      let brevityInstruction = '';
      if (brevity === 'ultra') {
        brevityInstruction = '\n\nMODO ULTRA-CONCISO ACTIVO: Responde en MÁXIMO 2 O 3 FRASES BREVES Y DIRECTAS. Solo el dato clave.';
      } else if (brevity === 'detallado') {
        brevityInstruction = '\n\nMODO DETALLADO: Ofrece una explicación completa pero ágil, no superes los 3 párrafos organizados.';
      } else {
        brevityInstruction = '\n\nMODO CONCISO ACTIVO: Responde en 1-2 párrafos cortos (o una breve lista de 3 puntos). Conciso, claro y directo.';
      }

      let enfoqueInstruction = '';
      if (enfoque === 'rutas') {
        enfoqueInstruction = '\n\nENFOQUE RUTAS Y HORARIOS: Prioriza calles clave, horarios de salida/tribuna/catedral/recogida y los mejores puntos para el espectador.';
      } else if (enfoque === 'historia') {
        enfoqueInstruction = '\n\nENFOQUE HISTORIA Y ARTE: Prioriza imagineros históricos (José de Mora, Risueño, Espinosa Cuadros, Pablo de Rojas, Mena), origen de la hermandad y detalles patrimoniales.';
      } else if (enfoque === 'musica') {
        enfoqueInstruction = '\n\nENFOQUE BANDAS Y MÚSICA: Menciona las formaciones musicales (Agrupación Musical, Cornetas y Tambores, Banda de Música) y marchas insignes asociadas.';
      }

      // Convert messages to Gemini format and sanitize
      const rawContents = messages
        .filter((m: { content: string }) => m && typeof m.content === 'string' && m.content.trim())
        .map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content.trim() }],
        }));

      // Drop any leading model/assistant messages because Gemini requires starting with 'user'
      while (rawContents.length > 0 && rawContents[0].role === 'model') {
        rawContents.shift();
      }

      // If empty, fallback to the latest query
      if (rawContents.length === 0) {
        return res.status(400).json({ error: 'No se encontraron mensajes válidos de usuario.' });
      }

      // Ensure strictly alternating roles (merge consecutive identical roles)
      const sanitizedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      for (const item of rawContents) {
        if (sanitizedContents.length > 0 && sanitizedContents[sanitizedContents.length - 1].role === item.role) {
          sanitizedContents[sanitizedContents.length - 1].parts[0].text += '\n\n' + item.parts[0].text;
        } else {
          sanitizedContents.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
        }
      }

      // Build grounding tools if requested
      const tools: any[] = [];
      if (searchGrounding) {
        tools.push({ googleSearch: {} });
      }
      if (mapsGrounding) {
        tools.push({ googleMaps: {} });
      }

      const config: any = {
        systemInstruction: BASE_SYSTEM_INSTRUCTION + brevityInstruction + enfoqueInstruction,
        temperature: 0.65,
      };

      if (tools.length > 0) {
        config.tools = tools;
        if (mapsGrounding) {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: 37.1773, // Granada
                longitude: -3.5986,
              },
            },
          };
        }
      }

      const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let replyText = '';
      const groundingSources: Array<{ title: string; uri: string; type: 'web' | 'map' }> = [];

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: sanitizedContents,
            config,
          });

          if (response && response.text) {
            replyText = response.text;

            // Extract Grounding metadata
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks && Array.isArray(chunks)) {
              for (const chunk of chunks) {
                if (chunk.web?.uri) {
                  groundingSources.push({
                    title: chunk.web.title || chunk.web.uri,
                    uri: chunk.web.uri,
                    type: 'web',
                  });
                }
                if (chunk.maps?.uri) {
                  groundingSources.push({
                    title: chunk.maps.title || 'Ubicación en Google Maps',
                    uri: chunk.maps.uri,
                    type: 'map',
                  });
                }
              }
            }
            break; // Success!
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed:`, err.message || err);
        }
      }

      // If all models were unavailable due to temporary 503 spikes, use local cofrade knowledge
      const lastUserPrompt = sanitizedContents[sanitizedContents.length - 1]?.parts[0]?.text || '';
      if (!replyText) {
        replyText = getLocalCofradeResponse(lastUserPrompt, brevity);
      }

      // Generate contextual follow-up quick prompts
      const followUps = generateFollowUps(lastUserPrompt, replyText);

      // Detect mentioned brotherhoods
      const menciones = detectMenciones(replyText);

      return res.json({
        reply: replyText,
        followUps,
        menciones,
        groundingSources,
      });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      return res.status(500).json({
        error: error.message || 'Error procesando la consulta con El Capataz Granadino.',
      });
    }
  });

  // Audio Transcription Endpoint using gemini-3.5-transcribe
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Falta el audio en base64.' });
      }

      const audioPart = {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            { text: 'Transcribe fielmente en texto en español lo que dice el audio sobre cofradías o Semana Santa.' },
          ],
        },
      });

      const transcript = response.text ? response.text.trim() : '';
      res.json({ transcript });
    } catch (err: any) {
      console.error('Error in /api/transcribe:', err);
      res.status(500).json({ error: err.message || 'Error transcribiendo audio.' });
    }
  });

  // Speech Generation Endpoint using gemini-3.8-flash-lite-tts
  app.post('/api/speak', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Falta el texto a vocalizar.' });
      }

      const cleanText = text.replace(/[*#_`]/g, '').slice(0, 400);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: 'Voz solemne y clara de capataz andaluz',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Fenrir' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
      } else {
        res.status(500).json({ error: 'No se generó audio' });
      }
    } catch (err: any) {
      console.error('Error in /api/speak:', err);
      res.status(500).json({ error: err.message || 'Error generando voz.' });
    }
  });

  // Helper to generate contextual follow-up suggestions
  function generateFollowUps(query: string, reply: string): string[] {
    const q = (query + ' ' + reply).toLowerCase();
    const suggestions: string[] = [];

    if (q.includes('aurora')) {
      suggestions.push('¿Cómo es el paso por los Grifos de San José?', '¿Qué bandas tocan tras La Aurora?', '¿A qué hora se recoge en San Miguel Bajo?');
    } else if (q.includes('gitano') || q.includes('sacromonte')) {
      suggestions.push('¿A qué hora sube la Cuesta del Chapiz?', '¿Cómo es la tradición de las hogueras y saetas?', '¿Qué historia tiene el Cristo del Consuelo?');
    } else if (q.includes('rescate') || q.includes('greñúo') || q.includes('greñuo')) {
      suggestions.push('¿Quién esculpió a El Greñúo?', '¿Por qué calles vuelve a la Magdalena?', '¿A qué hora entra en Carrera Oficial?');
    } else if (q.includes('silencio')) {
      suggestions.push('¿Por qué se apagan las luces en el Darro?', '¿Qué recorrido hace en la madrugada?', '¿Quién esculpió el Cristo de la Misericordia?');
    } else if (q.includes('carrera oficial')) {
      suggestions.push('¿Dónde ponerse si no se tiene silla?', '¿A qué hora entra la primera cofradía?', '¿Cómo es la salida por Puerta del Perdón?');
    } else if (q.includes('campo del príncipe') || q.includes('favores')) {
      suggestions.push('¿Cómo nació el rezo de las tres de la tarde?', '¿Cuándo sale la cofradía de los Favores de San Cecilio?', '¿Por qué la Cuesta de San Cecilio es tan difícil?');
    } else {
      suggestions.push('¿Cuáles son los puntos clave de este recorrido?', '¿Qué imagineros hicieron estas tallas?', '¿Qué cofradías coinciden a esa misma hora?');
    }

    return suggestions.slice(0, 3);
  }

  // Detect which brotherhood IDs might be mentioned
  function detectMenciones(text: string): string[] {
    const t = text.toLowerCase();
    const found: string[] = [];
    const mapping: Record<string, string> = {
      'borriquilla': 'borriquilla',
      'santa cena': 'santa-cena',
      'maravillas': 'maravillas',
      'despojado': 'despojado',
      'encarnación': 'encarnacion',
      'encarnacion': 'encarnacion',
      'trabajo': 'trabajo',
      'dolores': 'los-dolores',
      'rescate': 'el-rescate',
      'greñúo': 'el-rescate',
      'greñuo': 'el-rescate',
      'san agustín': 'san-agustin',
      'san agustin': 'san-agustin',
      'huerto': 'el-huerto',
      'lanzada': 'la-lanzada',
      'vía crucis': 'via-crucis',
      'via crucis': 'via-crucis',
      'esperanza': 'la-esperanza',
      'cañilla': 'la-canilla',
      'gitanos': 'los-gitanos',
      'estudiantes': 'estudiantes',
      'penas': 'las-penas',
      'rosario': 'el-rosario',
      'nazareno': 'el-nazareno',
      'aurora': 'la-aurora',
      'estrella': 'la-estrella',
      'concepción': 'la-concepcion',
      'concepcion': 'la-concepcion',
      'salesianos': 'salesianos',
      'silencio': 'el-silencio',
      'campo del príncipe': 'campo-principe',
      'ferroviarios': 'los-ferroviarios',
      'favores': 'los-favores',
      'escolapios': 'escolapios',
      'santo entierro': 'santo-entierro',
      'soledad de san jerónimo': 'soledad-san-jeronimo',
      'chías': 'soledad-san-jeronimo',
      'chias': 'soledad-san-jeronimo',
      'alhambra': 'alhambra',
      'facundillo': 'el-facundillo',
      'resucitado': 'resucitado',
    };

    for (const [key, id] of Object.entries(mapping)) {
      if (t.includes(key) && !found.includes(id)) {
        found.push(id);
      }
    }
    return found.slice(0, 2);
  }

  // Local fallback knowledge base for when Gemini API experiences temporary 503 spikes
  function getLocalCofradeResponse(query: string, brevity: string): string {
    const q = query.toLowerCase();

    if (q.includes('gitano') || q.includes('sacromonte') || q.includes('consuelo')) {
      return '¡A esta es! La **Cofradía de los Gitanos** (*Cristo del Consuelo y María Stma. del Sacromonte*) sale el **Miércoles Santo** a las **16:45 h** desde la **Abadía del Sacromonte**.\n\nPasa por **Ángel Ganivet** a las **19:30 h** y **Catedral** a las **20:45 h**. El momento cumbre es su regreso de madrugada subiendo por la **Cuesta del Chapiz** y las cuevas del Sacromonte entre hogueras de romero y saetas.';
    }

    if (q.includes('aurora') || q.includes('san miguel')) {
      return '¡Al cielo con Ella! La **Hermandad de la Aurora** sale el **Jueves Santo** a las **17:40 h** de la **Iglesia de San Miguel Bajo** en el Albayzín.\n\nPasa por **Ganivet** a las **20:30 h** y Catedral a las **21:45 h**. Lo más impresionante es la bajada y posterior subida de madrugada por la **Cuesta de San Gregorio** y la estrechez milimétrica de los **Grifos de San José**.';
    }

    if (q.includes('rescate') || q.includes('greñuo') || q.includes('greñúo')) {
      return '¡Oído a la voz! **Nuestro Padre Jesús del Rescate** (*«El Greñúo»*) procesiona el **Lunes Santo** desde la **Iglesia de Santa María Magdalena** a las **17:45 h**.\n\nPasa por **Ganivet** a las **20:45 h**, Catedral a las **22:00 h** y se recoge a las **00:00 h**. Destaca el fervor de su salida en calle Gracia y su paso majestuoso con túnica morada de terciopelo.';
    }

    if (q.includes('silencio') || q.includes('misericordia')) {
      return '¡Solemne y en tinieblas! **El Silencio** (*Cristo de la Misericordia*) sale en la **madrugada del Jueves al Viernes Santo** a las **00:00 h** de **San Pedro y San Pablo**.\n\nA su paso por la **Carrera del Darro** se apaga por completo el alumbrado público y solo se escucha el golpe sordo de un **tambor con sordina**. Pasa por Catedral a las **02:45 h**.';
    }

    if (q.includes('favores') || q.includes('campo del principe') || q.includes('campo del príncipe') || q.includes('tres de la tarde')) {
      return '¡Tradición cumbre de Granada! El **Viernes Santo a las 15:00 h en punto**, miles de granadinos se reúnen en el **Campo del Príncipe** ante el monumento de piedra del **Cristo de los Favores** para guardar riguroso silencio y rezar los tres credos pidiendo los tres favores.';
    }

    if (q.includes('alhambra') || q.includes('sabado') || q.includes('sábado')) {
      return '¡Estampa irrepetible! **Santa María de la Alhambra** procesiona el **Sábado Santo** a las **17:00 h** desde su iglesia dentro del recinto nazarí.\n\nSu paso de plata reproduce el **Patio de los Leones** y desciende por la **Puerta de la Justicia** y el bosque de la Alhambra hacia Ganivet (20:15 h) y Catedral (21:30 h).';
    }

    if (q.includes('carrera oficial') || q.includes('ganivet') || q.includes('itinerario oficial')) {
      return 'La **Carrera Oficial** es el tramo común para las 32 cofradías. Su orden es: **Ángel Ganivet (Tribuna Oficial) → Mesones → Placeta de las Pasiegas → Santa Iglesia Catedral → Puerta del Perdón / Cárcel Baja**.';
    }

    if (q.includes('chias') || q.includes('chías') || q.includes('san jeronimo') || q.includes('san jerónimo')) {
      return '**Las Chías** son personajes únicos de Granada que preceden a la **Soledad de San Jerónimo** el Viernes Santo. Visten largas hopas negras con plumas y tocan trompetas y tambores de hojalata del siglo XVI recordando a los heraldos de la Inquisición.';
    }

    return '¡A esta es, costalero! La Semana Santa de Granada cuenta con **32 hermandades federadas**, desde la Borriquilla el Domingo de Ramos hasta los Resucitados el Domingo de Resurrección, con escenarios inigualables en el **Albayzín**, **Sacromonte**, **Realejo** y la **Carrera Oficial**.\n\nPregúntame por cualquier cofradía, horario, calle o tradición concreta y te daré los datos exactos.';
  }

  // Weather cache for Granada
  let cachedWeatherData: unknown = null;
  let lastWeatherFetchTime = 0;
  const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min cache

  function getWeatherCondition(code: number): { text: string; icon: string; riesgo: 'optimo' | 'precaucion' | 'riesgo_alto' } {
    if (code === 0) return { text: 'Cielo despejado', icon: 'sun', riesgo: 'optimo' };
    if (code === 1 || code === 2) return { text: 'Poco nuboso', icon: 'sun-cloud', riesgo: 'optimo' };
    if (code === 3) return { text: 'Nublado', icon: 'cloud', riesgo: 'precaucion' };
    if (code >= 45 && code <= 48) return { text: 'Niebla / Neblina', icon: 'fog', riesgo: 'precaucion' };
    if (code >= 51 && code <= 55) return { text: 'Llovizna ligera', icon: 'drizzle', riesgo: 'riesgo_alto' };
    if (code >= 61 && code <= 65) return { text: 'Lluvia', icon: 'rain', riesgo: 'riesgo_alto' };
    if (code >= 80 && code <= 82) return { text: 'Chubascos', icon: 'shower', riesgo: 'riesgo_alto' };
    if (code >= 95) return { text: 'Tormenta', icon: 'thunderstorm', riesgo: 'riesgo_alto' };
    return { text: 'Intervalos nubosos', icon: 'cloud', riesgo: 'precaucion' };
  }

  const DIAS_SEMANA_SANTA_DATA = [
    { dia: 'Domingo de Ramos', cofradias: ['La Borriquilla', 'La Santa Cena', 'Las Maravillas', 'El Despojado', 'El Cautivo'], consejo: 'Tarde primaveral idónea para acompañar a los niños de la Borriquilla y la bajada de las Maravillas por el Darro.' },
    { dia: 'Lunes Santo', cofradias: ['El Trabajo (Zaidín)', 'Los Dolores', 'El Rescate', 'El Huerto', 'San Agustín'], consejo: 'El paso por el Puente Romano del Trabajo requiere atención a las rachas de viento vespertinas.' },
    { dia: 'Martes Santo', cofradias: ['La Lanzada', 'Vía Crucis', 'La Esperanza', 'La Cañilla'], consejo: 'Gran contraste térmico al anochecer en las estrecheces de San Juan de los Reyes y Plaza Nueva.' },
    { dia: 'Miércoles Santo', cofradias: ['Los Gitanos', 'Los Estudiantes', 'Paciencia y Penas', 'El Rosario', 'El Nazareno'], consejo: 'Noche fría en la subida al Sacromonte; llevar abrigo para las fogatas de la Cuesta del Chapiz.' },
    { dia: 'Jueves Santo', cofradias: ['La Concha', 'Salesianos', 'La Aurora', 'La Estrella', 'El Silencio'], consejo: 'Noche cumbre en el Albaicín: humedad fresca del Darro y empedrado deslizante en las cuestas.' },
    { dia: 'Viernes Santo', cofradias: ['Los Escolapios', 'Los Favores (15:00 h)', 'El Santo Sepulcro', 'La Soledad de San Jerónimo'], consejo: 'Rezo de las tres de la tarde al sol en el Campo del Príncipe; noche solemne en San Jerónimo.' },
    { dia: 'Sábado Santo', cofradias: ['Santa María de la Alhambra'], consejo: 'Paso por el bosque de la Alhambra a la caída de la tarde con temperaturas suaves y brisa.' },
    { dia: 'Domingo de Resurrección', cofradias: ['El Resucitado (Zaidín)', 'Los Facundillos'], consejo: 'Jornada luminosa con el tintineo de las campanillas de barro de los Facundillos en el centro.' },
  ];

  // Weather Endpoint for Granada
  app.get('/api/clima', async (req, res) => {
    try {
      const now = Date.now();
      if (cachedWeatherData && (now - lastWeatherFetchTime) < WEATHER_CACHE_TTL_MS) {
        return res.json(cachedWeatherData);
      }

      // Fetch actual forecast for Granada from Open-Meteo (lat: 37.1773, lng: -3.5986)
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=37.1773&longitude=-3.5986&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Europe%2FMadrid&forecast_days=8';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo returned status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};

      const currentCond = getWeatherCondition(current.weather_code ?? 0);
      const currentLluviaProb = hourly.precipitation_probability?.[0] ?? 0;

      // Build daily forecast for the 8 days of Semana Santa
      const diasPronostico = (daily.time || []).slice(0, 8).map((dateStr: string, idx: number) => {
        const diaMeta = DIAS_SEMANA_SANTA_DATA[idx] || {
          dia: `Día ${idx + 1}`,
          cofradias: [],
          consejo: 'Consultar el radar meteorológico antes de la salida.'
        };

        const wCode = daily.weather_code?.[idx] ?? 0;
        const cond = getWeatherCondition(wCode);
        const probLluvia = daily.precipitation_probability_max?.[idx] ?? 0;
        const tempMax = Math.round(daily.temperature_2m_max?.[idx] ?? 20);
        const tempMin = Math.round(daily.temperature_2m_min?.[idx] ?? 8);
        const precipMm = Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10;

        // Cofrade risk evaluation
        let riesgoCofrade: 'optimo' | 'precaucion' | 'riesgo_alto' = 'optimo';
        let recomendacionCofrade = 'Salida procesional sin incidencias meteorológicas previstas.';

        if (probLluvia > 45 || precipMm > 1.5) {
          riesgoCofrade = 'riesgo_alto';
          recomendacionCofrade = 'Riesgo alto de lluvia. Se recomienda a las hermandades activar el protocolo de refugios y consultar radar cada 30 min.';
        } else if (probLluvia >= 15 || cond.riesgo === 'precaucion') {
          riesgoCofrade = 'precaucion';
          recomendacionCofrade = 'Riesgo moderado / intervalos nubosos. Monitorizar la evolución en Ganivet y Pasiegas.';
        }

        return {
          fecha: dateStr,
          diaSanto: diaMeta.dia,
          tempMax,
          tempMin,
          probLluvia,
          precipMm,
          condicion: cond.text,
          icono: cond.icon,
          riesgoCofrade,
          recomendacionCofrade,
          cofradias: diaMeta.cofradias,
          consejoCapataz: diaMeta.consejo,
        };
      });

      // Key hourly evening windows (typical procession times: 16:00, 18:00, 20:00, 22:00, 00:00)
      const horasClave = [16, 18, 20, 22, 24].map((targetH) => {
        const hIdx = Math.min(targetH, (hourly.time?.length || 1) - 1);
        const temp = Math.round(hourly.temperature_2m?.[hIdx] ?? current.temperature_2m ?? 18);
        const prob = hourly.precipitation_probability?.[hIdx] ?? 0;
        const wCode = hourly.weather_code?.[hIdx] ?? 0;
        const cond = getWeatherCondition(wCode);

        return {
          hora: `${targetH === 24 ? '00' : targetH}:00`,
          temp,
          probLluvia: prob,
          condicion: cond.text,
        };
      });

      const result = {
        ciudad: 'Granada (España)',
        actualizadoEn: new Date().toISOString(),
        actual: {
          temperatura: Math.round(current.temperature_2m ?? 18),
          sensacion: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 18),
          humedad: Math.round(current.relative_humidity_2m ?? 50),
          vientoKm: Math.round(current.wind_speed_10m ?? 10),
          probLluvia: currentLluviaProb,
          precipitacionMm: current.precipitation ?? 0,
          condicion: currentCond.text,
          icono: currentCond.icon,
          riesgoGeneral: currentLluviaProb > 40 ? 'riesgo_alto' : currentLluviaProb > 15 ? 'precaucion' : 'optimo',
        },
        pronosticoSemanaSanta: diasPronostico,
        ventanaHorariaTarde: horasClave,
      };

      cachedWeatherData = result;
      lastWeatherFetchTime = now;
      res.json(result);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback with realistic Granada spring weather so UI never breaks
      const fallback = {
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
        pronosticoSemanaSanta: DIAS_SEMANA_SANTA_DATA.map((d, i) => ({
          fecha: `2026-03-${29 + i}`,
          diaSanto: d.dia,
          tempMax: 20 + (i % 3),
          tempMin: 8 + (i % 2),
          probLluvia: (i === 4 ? 25 : i === 2 ? 15 : 5),
          precipMm: 0,
          condicion: i === 4 ? 'Intervalos nubosos' : 'Cielo despejado',
          icono: i === 4 ? 'cloud' : 'sun',
          riesgoCofrade: i === 4 ? 'precaucion' : 'optimo',
          recomendacionCofrade: i === 4 ? 'Probabilidad moderada en la tarde-noche.' : 'Condiciones óptimas para la estación de penitencia.',
          cofradias: d.cofradias,
          consejoCapataz: d.consejo,
        })),
        ventanaHorariaTarde: [
          { hora: '16:00', temp: 20, probLluvia: 5, condicion: 'Despejado' },
          { hora: '18:00', temp: 19, probLluvia: 10, condicion: 'Poco nuboso' },
          { hora: '20:00', temp: 17, probLluvia: 10, condicion: 'Poco nuboso' },
          { hora: '22:00', temp: 14, probLluvia: 5, condicion: 'Despejado' },
          { hora: '00:00', temp: 12, probLluvia: 5, condicion: 'Despejado' },
        ],
      };
      res.json(fallback);
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Setup Vite dev server or production static serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`El Capataz Granadino server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
