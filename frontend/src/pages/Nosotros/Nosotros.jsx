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
    dudasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
 