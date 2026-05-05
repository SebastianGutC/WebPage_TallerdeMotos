import React, { useEffect, useRef, useState } from "react";
import "./CommentSection.css";
import gsap from "gsap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const STATIC_COMMENTS = [
  {
    id: 1,
    author: "Michel Alejandra Cardona Gomez",
    text: "Excelente servicio, los repuestos llegaron en perfecto estado y en tiempo récord. Sin duda volvería a comprar aquí.",
    time: "Hace 4 horas",
  },
  {
    id: 2,
    author: "Carlos Andrés Pérez",
    text: "Muy buena atención al cliente. Me asesoraron bien para encontrar el filtro correcto para mi moto. Totalmente recomendados.",
    time: "Hace 1 día",
  },
  {
    id: 3,
    author: "Laura Gómez Ríos",
    text: "Los precios son muy competitivos y la calidad de las piezas es excelente. El aceite Motul llegó sellado y original.",
    time: "Hace 2 días",
  },
  {
    id: 4,
    author: "Diego Martínez",
    text: "Primera vez comprando y quedé muy satisfecho. El proceso fue fácil y el envío rápido. ¡Volveré pronto!",
    time: "Hace 3 días",
  },
  {
    id: 5,
    author: "Valentina Torres",
    text: "Súper recomendado. Tenían el repuesto que necesitaba y que no encontré en ningún otro lado. Gran variedad de stock.",
    time: "Hace 5 días",
  },
];

const VISIBLE_CARDS = 3;
const SCROLL_THRESHOLD = 120;

export default function CommentSection() {
  const [comments, setComments] = useState(STATIC_COMMENTS);
  const [commentText, setCommentText] = useState("");
  const [userName] = useState("Juan Sebastián Gutiérrez Cuenca");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const accumRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const commentsLenRef = useRef(comments.length);

  //  Autoplay refs
  const autoplayRef = useRef(null);
  const isUserInteracting = useRef(false);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);
  useEffect(() => { commentsLenRef.current = comments.length; }, [comments]);

  //  Helpers
  const isInView = () => {
    const rect = sectionRef.current.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
  };

  const resetInteractionTimeout = () => {
    clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, 4000);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      if (
        isInView() &&
        !isUserInteracting.current &&
        !isAnimatingRef.current
      ) {
        goNext();
      }
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  //  Posicionar cards
  const positionCards = (idx, animate = false) => {
    const total = commentsLenRef.current;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const relPos = ((i - idx) % total + total) % total;

      if (relPos === 0) {
        const props = {
          x: 0, y: 0, rotation: 0, scale: 1,
          zIndex: total, opacity: 1, display: "block"
        };
        animate
          ? gsap.to(el, { ...props, duration: 0.45, ease: "power3.out" })
          : gsap.set(el, props);

      } else if (relPos < VISIBLE_CARDS) {
        const offset = relPos * 6;
        const rot = relPos % 2 === 0 ? relPos * 1.5 : -relPos * 1.5;

        const props = {
          x: offset * 1.5,
          y: offset,
          rotation: rot,
          scale: 1 - relPos * 0.03,
          zIndex: total - relPos,
          opacity: 1,
          display: "block",
        };

        animate
          ? gsap.to(el, { ...props, duration: 0.45, ease: "power3.out" })
          : gsap.set(el, props);

      } else {
        gsap.set(el, { display: "none", opacity: 0 });
      }
    });
  };

  // Avanzar
  const goNext = () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    const currentIdx = activeIndexRef.current;
    const currentEl = cardRefs.current[currentIdx];
    const nextIdx = (currentIdx + 1) % commentsLenRef.current;

    gsap.to(currentEl, {
      x: -60,
      y: 60,
      rotation: -12,
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(nextIdx);
        setIsAnimating(false);
        isAnimatingRef.current = false;
      },
    });
  };

  //  Effects

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, comments.length);
    positionCards(activeIndex);
  }, [comments]);

  useEffect(() => {
    positionCards(activeIndex, true);
  }, [activeIndex]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  // Scroll interacción
  useEffect(() => {
    const section = sectionRef.current;

    const handleWheel = (e) => {
      isUserInteracting.current = true;

      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.9 &&
        rect.bottom > window.innerHeight * 0.1;

      if (!inView) return;

      accumRef.current += e.deltaY;

      if (accumRef.current > SCROLL_THRESHOLD) {
        accumRef.current = 0;
        goNext();
      } else if (accumRef.current < -SCROLL_THRESHOLD) {
        accumRef.current = 0;

        if (!isAnimatingRef.current) {
          const prevIdx =
            (activeIndexRef.current - 1 + commentsLenRef.current) %
            commentsLenRef.current;
          setActiveIndex(prevIdx);
        }
      }

      resetInteractionTimeout();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  //  Nuevo comentario

  const handleShare = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: userName,
      text: commentText.trim(),
      time: "Ahora mismo",
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setActiveIndex(0);

    isUserInteracting.current = true;
    resetInteractionTimeout();
  };

  return (
    <section className="comments-section" ref={sectionRef}>
      <h3 className="comments-title">Comentarios</h3>

      <div className="comments-add-label">
        <span>Añadir un comentario</span>
        <button
          className="btn-add-comment"
          onClick={() => document.getElementById("comment-textarea").focus()}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className="comments-layout">

        {/* Formulario */}
        <div className="comment-form">
          <p className="comment-form-author">{userName}</p>

          <textarea
            id="comment-textarea"
            className="comment-textarea"
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              isUserInteracting.current = true;
              resetInteractionTimeout();
            }}
            placeholder="Añadir un comentario"
            rows={5}
          />

          <div className="comment-form-footer">
            <button className="btn-share" onClick={handleShare}>
              Compartir
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="deck-column">
          <div className="deck-container">
            {comments.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`comment-card ${i === activeIndex ? "active" : ""}`}
                onClick={() => {
                  isUserInteracting.current = true;
                  goNext();
                  resetInteractionTimeout();
                }}
              >
                <p className="comment-card-author">{c.author}</p>
                <p className="comment-card-text">{c.text}</p>
                <p className="comment-card-time">{c.time}</p>
              </div>
            ))}
          </div>

          <div className="deck-indicators">
            {comments.slice(0, Math.min(comments.length, 7)).map((_, i) => (
              <div
                key={i}
                className={`deck-dot${i === activeIndex ? " active" : ""}`}
                style={{ width: i === activeIndex ? "20px" : "6px" }}
                onClick={() => {
                  if (!isAnimating) {
                    isUserInteracting.current = true;
                    setActiveIndex(i);
                    resetInteractionTimeout();
                  }
                }}
              />
            ))}
            <span className="deck-hint">Scroll o Click para avanzar</span>
          </div>
        </div>

      </div>
    </section>
  );
}