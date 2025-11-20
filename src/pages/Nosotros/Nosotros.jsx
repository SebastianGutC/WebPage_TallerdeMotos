import React, { useState } from "react";
import "./Nosotros.css";
import nosotrosImg from "../../assets/Nosotrosimg/fnoso.png"; 
import tallerCertificadoImg from "../../assets/Nosotrosimg/taller-certificado.jpg";
import mecanicosExpertosImg from "../../assets/Nosotrosimg/mecanicos-expertos.jpg";
import personalizacionRealImg from "../../assets/Nosotrosimg/personalizacion-real.jpg";
import comunidadBikerImg from "../../assets/Nosotrosimg/comunidad-biker.png";
import servicioRapidoImg from "../../assets/Nosotrosimg/servicio-rapido.jpg"; // Nueva imagen
import garantiaImg from "../../assets/Nosotrosimg/garantia.jpg"; // Nueva imagen

const Nosotros = () => {
  // Datos de la timeline adaptados a MotorFix, con cinco años
  const timelineData = [
    {
      date: '2019',
      description: 'Iniciamos operaciones en un pequeño taller familiar, con la pasión por las motos como motor.'
    },
    {
      date: '2021',
      description: 'Nos consolidamos como referente local en personalización, expandiendo nuestros servicios.'
    },
    {
      date: '2023',
      description: 'Ampliación del equipo y mayor alcance regional, fortaleciendo nuestra comunidad biker.'
    },
    {
      date: '2024',
      description: 'Lanzamos servicios de mantenimiento preventivo avanzado.'
    },
    {
      date: '2025',
      description: 'Expandimos a nivel nacional, abriendo talleres en nuevas ciudades.'
    }
  ];

  // Estado para el item expandido/activo en timeline
  const [expandedItem, setExpandedItem] = useState(0); // Inicialmente, el primero expandido

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const featuresData = [
    {
      title: 'Taller Certificado',
      description: 'Nuestro taller está certificado por estándares internacionales, garantizando reparaciones de alta calidad y seguridad. Utilizamos equipos de última generación para diagnósticos precisos.',
      image: tallerCertificadoImg
    },
    {
      title: 'Mecánicos Expertos',
      description: 'Contamos con un equipo de mecánicos certificados con años de experiencia en motocicletas de todas las marcas. Siempre capacitados en las últimas tecnologías.',
      image: mecanicosExpertosImg
    },
    {
      title: 'Personalización Real',
      description: 'Ofrecemos personalizaciones únicas y a medida, desde cambios estéticos hasta mejoras de rendimiento. Tu moto, tu estilo, nuestra pasión.',
      image: personalizacionRealImg
    },
    {
      title: 'Comunidad Biker',
      description: 'Formamos parte de una comunidad apasionada por las motos. Organizamos eventos y compartimos consejos para que vivas la experiencia biker al máximo.',
      image: comunidadBikerImg
    },
    {
      title: 'Servicio Rápido y Eficiente',
      description: 'Entendemos la importancia de tu tiempo. Nuestros procesos optimizados garantizan reparaciones y mantenimientos en el menor tiempo posible, sin comprometer la calidad.',
      image: servicioRapidoImg
    },
    {
      title: 'Garantía en Todas las Reparaciones',
      description: 'Ofrecemos garantía completa en todos nuestros servicios. Si algo no queda perfecto, lo arreglamos gratis. Tu confianza es nuestra prioridad.',
      image: garantiaImg
    }
  ];

  return (
    <div className="nosotros-page">
      <section
        className="nosotros-hero"
        style={{ backgroundImage: `url(${nosotrosImg})` }}
      >
        <div className="nosotros-overlay">
          <div className="nosotros-hero-content">
            <h1>
              Nuestra <span className="light">Historia</span> & <br /> <span className="light"> Pasión</span> por las Motos
            </h1>
            <p>
              En MotorFix SAS somos especialistas en mantenimiento, diagnóstico y
              personalización de motocicletas. <span>Nuestra comunidad biker</span> nos
              respalda por la calidad, dedicación y compromiso que ofrecemos en cada servicio.
            </p>
          </div>
        </div>
      </section>

      <section className="nosotros-por-que">
        <h2>¿Por Qué Elegirnos?</h2>
        <div className="nosotros-feature-grid">
          {featuresData.map((feature, index) => (
            <div key={index} className="nosotros-feature-box">
              <h3>{feature.title}</h3>
              <img src={feature.image} alt={feature.title} className="nosotros-feature-image" />
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="nosotros-stats">
        <div className="nosotros-stat"><span>+300</span>Motos Reparadas</div>
        <div className="nosotros-stat"><span>+120</span>Personalizaciones</div>
        <div className="nosotros-stat"><span>5 Años</span>Experiencia</div>
        <div className="nosotros-stat"><span>6 Ciudades</span>Clientes</div>
      </section>

      <section className="nosotros-timeline-section">
        <div className="nosotros-container">
          <h2 className="nosotros-timeline-title">Nuestra Historia</h2>
          <div className="nosotros-timeline">
            <div className="nosotros-timeline-items">
              {timelineData.map((item, index) => {
                const isActive = expandedItem === index;
                return (
                  <div
                    key={index}
                    className={`nosotros-timeline-item ${isActive ? 'active' : ''}`}
                    onClick={() => toggleItem(index)}
                  >
                    <div className="nosotros-dot" aria-hidden="true" />
                    <div className="nosotros-content">
                      <h3>{item.date}</h3>
                      {isActive && (
                        <p className="nosotros-timeline-description">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;