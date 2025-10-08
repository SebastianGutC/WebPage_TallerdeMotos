import React from 'react';
import './nosotros.css';
import f_nosotros from '../../assets/fnoso.png';

const Nosotros = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(10,9,3,0.66), rgba(10,9,3,0.66)), url(${f_nosotros})`
  };

  return (
    <div className="nosotros-page">
      <section className="hero-section" style={heroStyle}>
        <div className="overlay">
          <h1 className="title">Nuestro camino al éxito</h1>
          <p className="description">
            Desde nuestros primeros pasos en el desarrollo de software, hemos crecido y evolucionado hasta convertirnos en un equipo comprometido con la innovación y la excelencia tecnológica. Nuestro objetivo es ofrecer soluciones inteligentes que impulsen el crecimiento y la transformación digital de las empresas.
          </p>
        </div>
      </section>

      <section className="timeline-section">
        <div className="container">
          <h2 className="timeline-title">Nuestra historia</h2>

          <div className="timeline">
            <div className="timeline-items">
              <div className="timeline-item active">
                <div className="dot" aria-hidden="true" />
                <div className="content">
                  <h3>Enero 2021</h3>
                  <p>Fundamos la empresa con la visión de crear soluciones digitales innovadoras y accesibles para todos.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="dot" aria-hidden="true" />
                <div className="content">
                  <h3>Junio 2022</h3>
                  <p>Lanzamos nuestro primer producto web, una plataforma enfocada en la optimización de procesos empresariales.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="dot" aria-hidden="true" />
                <div className="content">
                  <h3>Abril 2023</h3>
                  <p>Ampliamos nuestro equipo con nuevos desarrolladores y diseñadores para mejorar la experiencia de usuario.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="dot" aria-hidden="true" />
                <div className="content">
                  <h3>Septiembre 2024</h3>
                  <p>Iniciamos proyectos internacionales y fortalecimos nuestras alianzas tecnológicas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  // Nota: Las fuentes se aplican automáticamente vía CSS (nosotros.css). Si quieres una fuente específica en un elemento, agrega una clase o style inline.
};

export default Nosotros;