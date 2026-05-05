import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "./Card";
import "./CardStack.css";

import { faUsers, faMedal, faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";
import img1 from "../../../assets/Nosotrosimg/moteros-comunidad.jpg";
import img2 from "../../../assets/Nosotrosimg/motocalidad.jpg";
import img3 from "../../../assets/Nosotrosimg/neiva.png";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 1,
    iconLabel: faUsers,
    subtitle: "Comunidad MotorFix",
    title: "Más que un taller, una comunidad",
    description:
      "En MotorFix SAS no solo reparamos motos, construimos relaciones. Somos un punto de encuentro para motociclistas de Neiva que buscan confianza, asesoría honesta y un servicio que realmente entiende su pasión por las dos ruedas.",
    tags: ["Confianza", "Comunidad", "Atención Personalizada"],
    cta: "Agendar Cita",
    accentColor: "#d3130c",
    image: img1,
  },
  {
    id: 2,
    iconLabel: faMedal,
    subtitle: "Experiencia y Calidad",
    title: "Expertos que cuidan tu moto",
    description:
      "Nuestro equipo está conformado por técnicos especializados que trabajan con precisión y compromiso en cada detalle. En MotorFix SAS garantizamos diagnósticos claros y soluciones efectivas para que tu moto siempre esté en las mejores condiciones.",
    tags: ["Mecánica Especializada", "Diagnóstico", "Calidad"],
    cta: "Conocer Servicios",
    accentColor: "#e46e19",
    image: img2,
  },
  {
    id: 3,
    iconLabel: faHandshakeAngle,
    subtitle: "Compromiso Local",
    title: "Orgullosamente en Neiva",
    description:
      "Somos una empresa local que entiende las necesidades de los motociclistas de nuestra ciudad. En MotorFix SAS trabajamos con responsabilidad y cercanía, ofreciendo soluciones confiables para que ruedes seguro en cada recorrido.",
    tags: ["Neiva", "Responsabilidad", "Cercanía"],
    cta: "Visítanos",
    accentColor: "#edb714",
    image: img3,
  },
];

export default function CardStack() {
  const containerRef = useRef(null);
  const innerRef     = useRef(null);
  const cardRefs     = useRef([]);

  useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const GAP = 32;
    const CARD_HEIGHT = innerRef.current.offsetHeight; // ya será 100vh - 80px
    const totalScroll = (CARD_HEIGHT + GAP) * (cards.length - 1);

    // ── 1. Pin — empieza cuando el wrapper toca el borde inferior del header ──
    ScrollTrigger.create({
      trigger     : containerRef.current,
      start       : "top top+=104", //104px = altura del header fijo
      end         : `+=${totalScroll}`,
      pin         : true,
      pinSpacing  : true,
      anticipatePin: 1,
    });

    // ── 2. Timeline global de apilamiento ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger : containerRef.current,
        start   : "top top+=104", // ← mismo offset que el pin
        end     : `+=${totalScroll}`,
        scrub   : 1,
      },
    });

    // ── 3. Cards 1..N fuera del contenedor (abajo) ──
    cards.forEach((card, i) => {
      if (i === 0) return;
      gsap.set(card, { y: CARD_HEIGHT + GAP });
    });

    // ── 4. Texto de la primera card ──
    const firstItems = cards[0]?.querySelectorAll(".card-item");
    if (firstItems?.length) {
      gsap.set(firstItems, { opacity: 0, y: 28, filter: "blur(4px)" });
      gsap.to(firstItems, {
        opacity : 1,
        y       : 0,
        filter  : "blur(0px)",
        stagger : 0.09,
        duration: 0.65,
        ease    : "power3.out",
        delay   : 0.15,
      });
    }

    // ── 5. Segmentos por cada card siguiente ──
    cards.forEach((card, i) => {
      if (i === 0) return;

      const prevCard = cards[i - 1];
      const seg      = i - 1;
      const items    = card.querySelectorAll(".card-item");

      gsap.set(items, { opacity: 0, y: 28, filter: "blur(4px)" });

      tl.to(card,     { y: 0,          duration: 1, ease: "none" }, seg);
      tl.to(prevCard, { scale: 0.93,   duration: 1, ease: "none" }, seg);
      tl.to(items, {
        opacity  : 1,
        y        : 0,
        filter   : "blur(0px)",
        stagger  : 0.06,
        duration : 0.3,
        ease     : "power2.out",
      }, seg + 0.52);
    });

  }, containerRef);

  return () => ctx.revert();
}, []);

  return (
    <div ref={containerRef} className="stack-wrapper">
      <div ref={innerRef} className="cards-container">
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            data={card}
            index={i}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
}