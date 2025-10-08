import React, { useState } from 'react';
import './nosotros.css';
import f_nosotros from '../../assets/fnoso.png';

const Nosotros = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(10,9,3,0.66), rgba(10,9,3,0.66)), url(${f_nosotros})`
  };

  // Datos de la timeline 
  const timelineData = [
    {
      date: 'Enero 2021',
      description: 'Fundamos la empresa con la visión de crear soluciones digitales innovadoras y accesibles para todos.'
    },
    {
      date: 'Junio 2022',
      description: 'Lanzamos nuestro primer producto web, una plataforma enfocada en la optimización de procesos empresariales.'
    },
    {
      date: 'Abril 2023',
      description: 'Ampliamos nuestro equipo con nuevos desarrolladores y diseñadores para mejorar la experiencia de usuario.'
    },
    {
      date: 'Septiembre 2024',
      description: 'Iniciamos proyectos internacionales y fortalecimos nuestras alianzas tecnológicas.'
    }
  ];

  // Estado para el item expandido/activo (null = ninguno, o índice 0-3)
  const [expandedItem, setExpandedItem] = useState(0); // Inicialmente, el primero expandido

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
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
              {timelineData.map((item, index) => {
                const isActive = expandedItem === index;
                return (
                  <div
                    key={index}
                    className={`timeline-item ${isActive ? 'active' : ''}`}
                    onClick={() => toggleItem(index)}
                  >
                    <div className="dot" aria-hidden="true" />
                    <div className="content">
                      <h3>{item.date}</h3>
                      {isActive && (
                        <p className="timeline-description">{item.description}</p>
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