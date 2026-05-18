import Motocicleta from "../models/motocicletaModel.js";
import { traduccionesEstaticas } from "../utils/motoTranslations.js";

const traducirCampo = (texto) => {
  if (!texto) return "No especificado";
  const clave = texto.toLowerCase().trim();

  // Búsqueda exacta
  if (traduccionesEstaticas[clave]) return traduccionesEstaticas[clave];

  // Búsqueda parcial — si contiene alguna clave conocida
  for (const [en, es] of Object.entries(traduccionesEstaticas)) {
    if (clave.includes(en)) return es;
  }

  // Si no encuentra nada devuelve el original
  return texto;
};

const traducirDatosNinja = (moto) => {
  return {
    make: moto.make ?? "No especificado",
    model: moto.model ?? "No especificado",
    year: String(moto.year ?? ""),
    type: traducirCampo(moto.type),
    displacement: moto.displacement ?? "No especificado",
    engine: traducirCampo(moto.engine),
    front_brakes: traducirCampo(moto.front_brakes),
    rear_brakes: traducirCampo(moto.rear_brakes),
    fuel_system: traducirCampo(moto.fuel_system),
    transmission: traducirCampo(moto.transmission),
  };
};

// ── Parsear respuesta de Gemini ──
const parsearRespuestaGemini = (text) => {
  if (!text) return null;

  let t = text.replace(/```json|```/g, "").trim();
  if (t === "null") return null;

  const inicio = t.indexOf("{");
  const fin = t.lastIndexOf("}");
  if (inicio !== -1 && fin !== -1) t = t.substring(inicio, fin + 1);

  try {
    return JSON.parse(t);
  } catch {
    console.error("JSON inválido de Gemini:", t);
    return null;
  }
};

// ── 0. Buscar en BD local con Mongoose ──
const buscarEnBDLocal = async (make, model, year) => {
  try {
    const filtro = {};
    if (make) filtro.marca = { $regex: make, $options: "i" };
    if (year) filtro.modelo = String(year);

    // Buscar con y sin espacios en el modelo
    if (model) {
      const modelSinEspacios = model.replace(/\s+/g, "");
      const modelConEspacios = model.replace(/([a-zA-Z])(\d)/g, "$1 $2");
      filtro.nombre = {
        $regex: `${model}|${modelSinEspacios}|${modelConEspacios}`,
        $options: "i",
      };
    }

    console.log("🔍 Filtro BD:", JSON.stringify(filtro));
    const moto = await Motocicleta.findOne(filtro);
    console.log("📦 Resultado BD:", moto);

    if (!moto) return null;
    return moto;
  } catch (error) {
    console.error("Error BD local:", error);
    return null;
  }
};

// ── Generar variantes del modelo ──
const generarVariantes = (make, model) => {
  const variantes = new Set();
  const modelLimpio = model?.trim() ?? "";
  const makeLimpio = make?.trim() ?? "";

  // Original
  variantes.add({ make: makeLimpio, model: modelLimpio });

  // Sin espacios: "XTZ 125" → "XTZ125"
  variantes.add({ make: makeLimpio, model: modelLimpio.replace(/\s+/g, "") });

  // Con espacio entre letras y números: "XTZ125" → "XTZ 125"
  variantes.add({
    make: makeLimpio,
    model: modelLimpio.replace(/([a-zA-Z])(\d)/g, "$1 $2"),
  });

  // Con guión: "MT07" → "MT-07"
  variantes.add({
    make: makeLimpio,
    model: modelLimpio.replace(/([a-zA-Z])(\d)/g, "$1-$2"),
  });

  // Sin guión: "MT-07" → "MT07"
  variantes.add({ make: makeLimpio, model: modelLimpio.replace(/-/g, "") });

  // Sin guión con espacio: "MT-07" → "MT 07"
  variantes.add({ make: makeLimpio, model: modelLimpio.replace(/-/g, " ") });

  // Uppercase
  variantes.add({
    make: makeLimpio.toUpperCase(),
    model: modelLimpio.toUpperCase(),
  });

  // Solo modelo sin marca (por si el usuario escribe la marca dentro del modelo)
  variantes.add({ make: "", model: modelLimpio });

  return [...variantes];
};

// ── 1. Buscar en API Ninja ──
const buscarEnAPINinja = async (make, model, year) => {
  try {
    const variantes = generarVariantes(make, model);
    console.log(`🔄 Probando ${variantes.length} variantes en API Ninja...`);

    // Buscar todas las variantes en paralelo
    const resultados = await Promise.all(
      variantes.map(async (v) => {
        try {
          const params = new URLSearchParams();
          if (v.make) params.append("make", v.make);
          if (v.model) params.append("model", v.model);
          if (year) params.append("year", year);

          const response = await fetch(
            `https://api.api-ninjas.com/v1/motorcycles?${params.toString()}`,
            {
              headers: { "X-Api-Key": process.env.API_NINJA_KEY },
            },
          );

          if (!response.ok) return null;

          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) return null;

          const filtrados = year
            ? data.filter((m) => String(m.year) === String(year))
            : data;

          return filtrados.length > 0 ? filtrados[0] : null;
        } catch {
          return null;
        }
      }),
    );

    // Tomar el primer resultado válido
    const encontrada = resultados.find((r) => r !== null);
    if (!encontrada) return null;

    console.log(
      "✅ Moto encontrada en API Ninja:",
      encontrada.make,
      encontrada.model,
      encontrada.year,
    );
    return traducirDatosNinja(encontrada);
  } catch (error) {
    console.error("Error API Ninja:", error);
    return null;
  }
};

// ── 2. Buscar en Gemini ──
const buscarEnGemini = async (make, model, year) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // ← process.env
    if (!apiKey) throw new Error("No se encontró la API Key de Gemini");

    const prompt = `
Eres una base de datos técnica de motocicletas. Tu única función es devolver especificaciones REALES y VERIFICADAS.

REGLAS ESTRICTAS:
- Solo devuelve información si tienes CERTEZA ABSOLUTA de que ese modelo y ese año exacto existen.
- Si el año no coincide con los años de producción real de ese modelo, devuelve null.
- Si el modelo no existe o nunca fue fabricado en ese año, devuelve null.
- NO inventes especificaciones. NO aproximes. NO supongas.
- NO devuelvas datos de un año diferente al solicitado.
- Si tienes dudas, devuelve null. Es preferible null que datos incorrectos.
- Toda la información debe estar en ESPAÑOL.

Motocicleta solicitada: ${make ? make + " " : ""}${model} año ${year}

Antes de responder verifica mentalmente:
1. ¿Existe realmente este modelo?
2. ¿Fue fabricado específicamente en el año ${year}?
3. ¿Tengo datos verificados de ese año exacto?
Si alguna respuesta es NO → devuelve null.

Si todas son SÍ, devuelve ÚNICAMENTE este JSON sin markdown ni texto extra:

{
  "make": "marca real",
  "model": "modelo real",
  "year": "${year}",
  "type": "tipo en español",
  "displacement": "cilindraje en cc",
  "engine": "tipo de motor en español",
  "front_brakes": "freno delantero en español",
  "rear_brakes": "freno trasero en español",
  "fuel_system": "sistema de combustible en español",
  "transmission": "transmisión en español"
}

Si no tienes información 100% verificada devuelve exactamente: null
    `.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Gemini:", JSON.stringify(errorData, null, 2));
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Respuesta Gemini:", text);

    return parsearRespuestaGemini(text);
  } catch (error) {
    console.error("Error Gemini:", error);
    return null;
  }
};

// ── Función principal exportada como controlador ──
export const buscarMoto = async (req, res) => {
  const { make, model, year } = req.query;
  console.log(`🔍 Buscando: ${make} ${model} ${year}`);

  try {
    // 0. BD local
    console.log("0️⃣ Consultando base de datos local...");
    const motoLocal = await buscarEnBDLocal(make, model, year);
    if (motoLocal) return res.json(motoLocal);

    // 1. API Ninja
    console.log("1️⃣ No encontrada localmente, consultando API Ninja...");
    const motoNinja = await buscarEnAPINinja(make, model, year);
    if (motoNinja) return res.json(motoNinja);

    // 2. Gemini
    console.log("2️⃣ No encontrada en API Ninja, consultando Gemini...");
    const motoGemini = await buscarEnGemini(make, model, year);
    if (motoGemini) return res.json(motoGemini);

    // 3. No encontrada → formulario manual
    console.log("3️⃣ No encontrada en ninguna fuente.");
    return res.status(404).json(null);
  } catch (error) {
    console.error("💥 Error general:", error.message);
    res.status(500).json({ message: "Error al buscar motocicleta." });
  }
};
