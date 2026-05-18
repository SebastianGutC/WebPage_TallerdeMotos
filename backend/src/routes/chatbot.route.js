import express from "express";
import Producto from "../models/productoModel.js"; 
import Servicio from "../models/servicioModel.js"; 

const router = express.Router();

const buildSystemPrompt = (productos, servicios) => {
  const listaProductos = productos.map(p =>
    `- ${p.nombre} (${p.categoria} – $${p.precio.toLocaleString("es-CO")} – ${p.stock})`
  ).join("\n");

  const listaServicios = servicios.map(s =>
    `- ${s.nombre} – $${s.precio.toLocaleString("es-CO")}`
  ).join("\n");

  return `
Eres un asistente experto en motos del Taller MotorFix. Solo en el PRIMER saludo debes presentarte como "Asistente de MotorFix". En el resto de conversaciones NO debes presentarte ni mencionar constantemente el taller, solo responder lo que se te pregunte.

Tu función principal:
1. Responder dudas sobre motos.
2. Recomendar servicios de mantenimiento o reparación según el problema descrito.
3. Sugerir repuestos relevantes cuando sea apropiado, usando únicamente el inventario disponible.

Repuestos disponibles:
${listaProductos}

Servicios del taller (con precios en COP):
${listaServicios}

Guía de comportamiento:
- Si el usuario describe un problema (ruido, vibración, falla, humo, frenado débil, etc.), primero explica la posible causa y luego recomienda el servicio adecuado.
- Si existe un repuesto relacionado y está DISPONIBLE, recomiéndalo de forma natural.
- Si está NO disponible, indícalo y sugiere alternativas o el servicio correspondiente.
- Responde siempre de manera clara, profesional y con formato organizado (listas, pasos, negritas).
- No inventes repuestos nuevos ni servicios extra.
- Si te preguntan por horarios: el taller abre de lunes a sábado de 8am a 6pm.
- Si te preguntan por ubicación: el taller está en Calle 123 #45-67, Neiva.
- Si no sabes alguna información, dirige al cliente a la página web en el apartado servicios o repuestos.
- No te extiendas demasiado; sé útil, preciso y directo.
  `.trim();
};

// Cache del prompt
let cachedPrompt = null;
let cacheTime = null;

router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ message: "La pregunta es obligatoria." });
  }

  try {
    // Regenerar cache cada 5 minutos
    if (!cachedPrompt || Date.now() - cacheTime > 5 * 60 * 1000) {
      const [productos, servicios] = await Promise.all([
        Producto.find({}, "nombre categoria precio disponible"),
        Servicio.find({}, "nombre precio"),
      ]);
      cachedPrompt = buildSystemPrompt(productos, servicios);
      cacheTime = Date.now();
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: cachedPrompt }],
          },
          contents: [
            { role: "user", parts: [{ text: question }] },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Error Gemini:", data.error);
      return res.status(500).json({ message: "Error en Gemini", error: data.error });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "No pude generar una respuesta.";

    res.json({ text });

  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ message: "Error al contactar el asistente.", detalle: error.message });
  }
});

export default router;