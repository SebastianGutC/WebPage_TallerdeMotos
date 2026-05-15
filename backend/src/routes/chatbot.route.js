import express from "express";
import { config } from "../config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { question, systemPrompt } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ message: "La pregunta es obligatoria." });
  }

  try {

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            { role: "user", parts: [{ text: question }] }
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini status:", response.status);         // ← aquí adentro
    console.log("Gemini response:", JSON.stringify(data, null, 2)); // ← aquí adentro

    if (data.error) {
      return res.status(500).json({ message: "Error en Gemini", error: data.error });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "No pude generar una respuesta.";

    res.json({ text });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Error al contactar el asistente." });
  }
});

export default router;