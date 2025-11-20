import React, { useRef } from "react";
import DialogflowWidget from "../../components/ChatBot/ChatBot.jsx";
import "./Dudas.css";
import fixer from "../../assets/fixer_icon.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export default function Dudas() {

  const chatRef = useRef(null);

  const handleScrollToChat = () => {
    // hace scroll hacia el chat y enfoca el input
    const chatElement = document.getElementById("chatbot");
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => chatRef.current?.focusInput(), 500); // pequeño delay para asegurar render
  };

  return (
    <div className="grid-container dudas-container">
      <div className="grid-x grid-margin-x grid-padding-y align-middle">

        {/* ==== IZQUIERDA (TEXTO MODERNO) ==== */}
        <div className="cell small-12 medium-6 dudas-text-left">

          <h1 className="dudas-title">
            Fixer está aquí
            <br /> 
            <span className="dudas-icon">
              <img src={fixer} alt="icono" />
            </span>
            para resolver<br />
            tus dudas y apoyarte.
          </h1>

          <p className="dudas-subtext">
            Chatea con nuestro asistente sobre <span className="lightapi-bg">servicios, precios, horarios, repuestos</span> y más.
          </p>
          <p className="dudas-subtext"> 
          Haz tus preguntas y recibe respuesta al instante.
          </p>

          <button className="dudas-button" onClick={handleScrollToChat}>
          <span className="dudas-button-text">HABLAR CON FIXER</span>
          <FontAwesomeIcon icon={faCircleQuestion} className="dudas-button-icon" />
          </button>

        </div>

        {/* ==== DERECHA (CHATBOT, SIN CAMBIAR SU FUNCIONALIDAD) ==== */}
        <div className="cell small-12 medium-6 chatbot-right">
          <DialogflowWidget ref={chatRef} />
        </div>

      </div>
    </div>
  );
}

