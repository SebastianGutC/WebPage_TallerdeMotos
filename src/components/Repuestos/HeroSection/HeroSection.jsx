import React from "react";
import ImgHeroSectionRepuestos from "../../../assets/RepuestosImg/ImagenTallerMotos.jpg";
import "./HeroSection.css";

const HeroSection = () => {
  const scrollToCatalogo = () => {
    const catalogo = document.getElementById("catalogo-repuestos");
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-repuestos">
      <img
        src={ImgHeroSectionRepuestos}
        alt="Hero sección repuestos"
        className="hero-image"
      />
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Encuentra los mejores <span>repuestos</span> para tu moto
          </h1>
          <p>Calidad, rendimiento y confianza en cada pieza.</p>

          {/* 👇 Texto que actúa como enlace */}
          <p className="link-ver-catalogo" onClick={scrollToCatalogo}>
            Ver catálogo →
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
