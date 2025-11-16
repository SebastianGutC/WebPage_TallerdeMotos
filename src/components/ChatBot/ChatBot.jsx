import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; 
import "./chatBot.css";
import { SYSTEM_PROMPT } from "../../assets/js/InfoEmpresa";

const API_KEY = "AIzaSyDYneNSIgWNAJd_8X_CI0aYo5NOdP05gGM";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

function limpiarSaludo(text, isFirstMessage) {
  if (isFirstMessage) return text;

  let t = text ?? "";

  // 1) Quitar saludo inicial tipo "Hola", "¡Hola!", "Buenas", etc. (y lo que venga junto hasta un punto/fin de frase)
  t = t.replace(
    /^\s*¡?\s*(hola|buenas(?:\s+(?:días|tardes|noches))?|buenos\s+días|buenas\s+tardes|buenas\s+noches)[^\n.!?]*[.!?]?\s*/i,
    ""
  );

  // 2) Quitar frases tipo "Soy ... asistente de MotorFix", "Soy tu asistente", etc.
  t = t.replace(/\bsoy\b[^.\n!?]*\b(asistente|motorfix|motorfix|motorfix)\b[^.\n!?]*[.!?]?\s*/i, "");

  // 3) Eliminar cualquier puntuación o espacios sobrantes al inicio (.,:;-¡! etc.)
  t = t.replace(/^[\s\.,:;¡!¿\-\—]+/, "");

  // 4) Trim final para limpiar espacios en ambos lados
  return t.trim();
}

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
          API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
              { role: "user", parts: [{ text: userQuestion }] }
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.warn("Gemini Error:", data.error);

      
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              "Lo siento, este servicio no está disponible en este momento. El asistente está saturado o no puede ofrecer una respuesta.",
          },
        ]);
      } else {
        let botText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Lo siento, no pude generar una respuesta.";

        const isFirstBotMessage =
          messages.filter((m) => m.role === "bot").length === 0;

        botText = limpiarSaludo(botText, isFirstBotMessage);

        setMessages((prev) => [...prev, { role: "bot", text: botText }]);
      }
    } catch (error) {
      console.warn("Fetch Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "Lo siento, este servicio no está disponible en este momento. El asistente está saturado o no puede ofrecer una respuesta.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chatbot-wrap">
      <div className="chat-card">
        <div className="chat-header">
          <h1>Asistente virtual de MotorFix</h1>
          <small>Respuestas automáticas con Gemini</small>
        </div>

        <div className="chat-body">
          <div className="messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="message bot typing">escribiendo...</div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="chat-footer">
            <div className="chat-input">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
            </div>
            <button className="btn-send" onClick={handleSend} disabled={loading}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

