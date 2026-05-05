import React, { useRef, useLayoutEffect } from "react";
import DialogflowWidget from "../../components/ChatBot/ChatBot.jsx";
import "./Dudas.css";
import fixer from "../../assets/fixer_icon.png";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export default function Dudas() {

  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const chatBoxRef = useRef(null);

  useLayoutEffect(() => {
  const ctx = gsap.context(() => {

    // Estado inicial
    gsap.set(textRef.current, {
      opacity: 0,
      y: 60
    });

    gsap.set(chatBoxRef.current, {
      opacity: 0,
      y: 80,
      scale: 0.9
    });

    // Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", // cuando entra en pantalla
        toggleActions: "play none none none"
      }
    });

    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to(chatBoxRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5");

  }, containerRef);

  return () => ctx.revert();
}, []);

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
    <div ref={containerRef} className="grid-container dudas-container">
      <div className="grid-x grid-margin-x grid-padding-y align-middle">

        {/* ==== IZQUIERDA (TEXTO MODERNO) ==== */}
        <div ref={textRef} className="cell small-12 medium-6 dudas-text-left">

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
        <div ref={chatBoxRef} className="cell small-12 medium-6 dudas-chat-right">
          <DialogflowWidget ref={chatRef} />
        </div>

      </div>
    </div>
  );
}

