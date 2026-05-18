import { GoogleGenerativeAI } from "@google/generative-ai";

export const buscarMoto = async (make, model, year) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("No se encontró la API Key de Gemini");
    }

   const prompt = `
Eres una base de datos técnica de motocicletas. Tu única función es devolver especificaciones REALES y VERIFICADAS.

REGLAS ESTRICTAS:
- Solo devuelve información si tienes CERTEZA ABSOLUTA de que ese modelo y ese año exacto existen.
- Si el año no coincide con los años de producción real de ese modelo, devuelve null.
- Si el modelo no existe o nunca fue fabricado en ese año, devuelve null.
- NO inventes especificaciones. NO aproximes. NO supongas.
- NO devuelvas datos de un año diferente al solicitado.
- Si tienes dudas, devuelve null. Es preferible null que datos incorrectos.

Motocicleta solicitada: ${make ? make + " " : ""}${model} año ${year}

Antes de responder verifica mentalmente:
1. ¿Existe realmente este modelo?
2. ¿Fue fabricado específicamente en el año ${year}?
3. ¿Tengo datos verificados de ese año exacto?
Si alguna respuesta es NO → devuelve null.

Si todas las respuestas son SÍ, devuelve ÚNICAMENTE este JSON válido sin markdown, sin bloques de código, sin texto extra:

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
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    // VALIDAR ERROR HTTP
    if (!response.ok) {
      const errorData = await response.json();

      console.error(
        "Error Gemini detallado:",
        JSON.stringify(errorData, null, 2)
      );

      throw new Error(
        errorData?.error?.message ||
          `Error Gemini ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Respuesta Gemini:", data);

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return null;
    }

    // LIMPIAR RESPUESTA
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // SI RESPONDE null
    if (text === "null") {
      return null;
    }

    // EXTRAER JSON SI VIENE TEXTO EXTRA
    const inicio = text.indexOf("{");
    const fin = text.lastIndexOf("}");

    if (inicio !== -1 && fin !== -1) {
      text = text.substring(inicio, fin + 1);
    }

    console.log("JSON limpio:", text);

    // PARSEAR JSON
    try {
      return JSON.parse(text);
    // eslint-disable-next-line no-unused-vars
    } catch (parseError) {
      console.error("JSON inválido:", text);
      return null;
    }
  } catch (error) {
    console.error("Error general Gemini:", error);
    return null;
  }
};