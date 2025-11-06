import React from "react";
import "./HeroSection.css";
import heroImage from "../../../assets/Homeimg/herosec.png";

const HeroSection = () => {
  return (
    <section
      className="herosec"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="overlay-sec">
        <div className="h-content">
          <h1>
            Expertos en: <br /> <span>Reparación y Mantenimiento</span>
          </h1>
          <p>
            Somos especialistas en el diagnóstico, reparación y mantenimiento de
            motocicletas.<span className="highlight-bg"> Nuestro equipo altamente capacitado</span> garantiza un
            servicio confiable, rápido y con la más alta calidad para mantener
            tu moto siempre lista para rodar.
          </p>
          <button className="btn-agendar">Agendar cita</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;