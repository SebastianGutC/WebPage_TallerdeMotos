import React, { useRef } from "react";
import "./Nosotros.css";

import NosotrosHero from "../../components/Nosotros/NosotrosHero/NosotrosHero";
import CardStack    from "../../components/Nosotros/NosotrosCard/CardStack";
import Dudas        from "../Api/Dudas";

const Nosotros = () => {
  const cardStackRef = useRef(null);
  const dudasRef     = useRef(null);

  const scrollToCardStack = () => {
    cardStackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDudas = () => {
    const element = dudasRef.current;

    if (!element) return;

    const offset = 80; // ajusta según tu navbar

    const top =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <div className="nosotros-page">
      <NosotrosHero
        onComunidadClick={scrollToCardStack}
        onInfoClick={scrollToDudas}
      />
      <div ref={dudasRef}>
        <Dudas />
      </div>
      <div ref={cardStackRef}>
        <CardStack />
      </div>

      <div className="stack-footer-gap" />
    </div>
  );
};

export default Nosotros;
 