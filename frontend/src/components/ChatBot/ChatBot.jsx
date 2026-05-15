import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import ReactMarkdown from "react-markdown"; 
import "./chatBot.css";
import API from "../../services/Api";
import { SYSTEM_PROMPT } from "../../assets/js/InfoEmpresa";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage} from "@fortawesome/free-solid-svg-icons";

const API_KEY = "AIzaSyDYneNSIgWNAJd_8X_CI0aYo5NOdP05gGM";

const Chatbot = forwardRef((props, ref) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current?.focus(), // función que se puede llamar desde afuera
  }));

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


  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const res = await API.post("/chatbot", {
        question: userQuestion,
        systemPrompt: SYSTEM_PROMPT,
      });

      let botText = res.data.text;

      const isFirstBotMessage =
        messages.filter((m) => m.role === "bot").length === 0;

      botText = limpiarSaludo(botText, isFirstBotMessage);

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);

    } catch (error) {
      console.warn("Error chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Lo siento, el asistente no está disponible en este momento.",
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
                ref={inputRef}
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
            </div>
            <button className="btn-send" onClick={handleSend} disabled={loading}>
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
});

export default Chatbot;