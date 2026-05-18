import { GoogleGenerativeAI } from "@google/generative-ai";
export const buscarMotoConGemini = async (make, model) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("No se encontró la API Key de Gemini");
    }

    const prompt = `
Devuelve ÚNICAMENTE un JSON válido.

NO uses markdown.
NO uses bloques de código.
NO agregues explicaciones.
NO agregues texto extra.

La motocicleta es:
${make} ${model}

El JSON debe tener EXACTAMENTE esta estructura:

{
  "make": "marca",
  "model": "modelo",
  "year": "año",
  "type": "tipo",
  "displacement": "cilindraje",
  "engine": "motor",
  "front_brakes": "freno delantero",
  "rear_brakes": "freno trasero",
  "fuel_system": "sistema combustible",
  "transmission": "transmisión"
}

Si no encuentras información confiable responde únicamente:
null
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