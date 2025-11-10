import React, { useState } from "react";
import "./Nosotros.css";
import nosotrosImg from "../../assets/fnoso.png"; 
import tallerCertificadoImg from "../../assets/taller-certificado.jpg";
import mecanicosExpertosImg from "../../assets/mecanicos-expertos.jpg";
import personalizacionRealImg from "../../assets/personalizacion-real.jpg";
import comunidadBikerImg from "../../assets/comunidad-biker.png";

const Nosotros = () => {
  // Datos de la timeline adaptados a MotorFix
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
    }
  ];

  // Estado para el item expandido/activo
  const [expandedItem, setExpandedItem] = useState(0); // Inicialmente, el primero expandido

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', text: '', image: '' });

  const openModal = (title, text, image) => {
    setModalContent({ title, text, image });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({ title: '', text: '', image: '' });
  };

  return (
    <div className="nosotros-page">
      {/* HERO SECTION (SIN CAMBIOS) */}
      <section
        className="nosotros-hero"
        style={{ backgroundImage: `url(${nosotrosImg})` }}
      >
        <div className="nosotros-overlay">
          <div className="nosotros-hero-content">
            <h1>
              Nuestra Historia & <br /> <span>Pasion por las Motos</span>
            </h1>
            <p>
              En MotorFix SAS somos especialistas en mantenimiento, diagnóstico y
              personalización de motocicletas. <span>Nuestra comunidad biker</span> nos
              respalda por la calidad, dedicación y compromiso que ofrecemos en cada servicio.
            </p>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS (SIN CAMBIOS) */}
      <section className="nosotros-por-que">
        <h2>¿Por Qué Elegirnos?</h2>
        <div className="nosotros-feature-grid">
          <div 
            className="nosotros-feature-box" 
            onClick={() => openModal(
              ' Taller Certificado', 
              'Nuestro taller está certificado por estándares internacionales, garantizando reparaciones de alta calidad y seguridad. Utilizamos equipos de última generación para diagnósticos precisos.',
              tallerCertificadoImg 
            )}
          >
             Taller Certificado
          </div>
          <div 
            className="nosotros-feature-box" 
            onClick={() => openModal(
              ' Mecánicos Expertos', 
              'Contamos con un equipo de mecánicos certificados con años de experiencia en motocicletas de todas las marcas. Siempre capacitados en las últimas tecnologías.',
              mecanicosExpertosImg 
            )}
          >
             Mecánicos Expertos
          </div>
          <div 
            className="nosotros-feature-box" 
            onClick={() => openModal(
              ' Personalización Real', 
              'Ofrecemos personalizaciones únicas y a medida, desde cambios estéticos hasta mejoras de rendimiento. Tu moto, tu estilo, nuestra pasión.',
              personalizacionRealImg 
            )}
          >
             Personalización Real
          </div>
          <div 
            className="nosotros-feature-box" 
            onClick={() => openModal(
              ' Comunidad Biker', 
              'Formamos parte de una comunidad apasionada por las motos. Organizamos eventos y compartimos consejos para que vivas la experiencia biker al máximo.',
              comunidadBikerImg 
            )}
          >
             Comunidad Biker
          </div>
        </div>
      </section>

      {/* LÍNEA DEL TIEMPO (NUEVA, INTERACTIVA) */}
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

      {/* STATS (SIN CAMBIOS) */}
      <section className="nosotros-stats">
        <div className="nosotros-stat"><span>+300</span>Motos Reparadas</div>
        <div className="nosotros-stat"><span>+120</span>Personalizaciones</div>
        <div className="nosotros-stat"><span>5 Años</span>Experiencia</div>
        <div className="nosotros-stat"><span>6 Ciudades</span>Clientes</div>
      </section>

      {/* MODAL (SIN CAMBIOS) */}
      {modalOpen && (
        <div className="nosotros-modal-overlay" onClick={closeModal}>
          <div className="nosotros-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="nosotros-modal-close" onClick={closeModal}>×</button>
            <img src={modalContent.image} alt={modalContent.title} className="nosotros-modal-image" />
            <h3>{modalContent.title}</h3>
            <p>{modalContent.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nosotros;