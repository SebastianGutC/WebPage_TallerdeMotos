import React from "react";
import "./RepuestoCard.css"

const RepuestoCard = ({ imagen, nombre, tipo, marca, modelo, precio, disponible }) => {
  return (
    <div className="cell small-12 medium-6 large-4">
      <div className="card repuesto-card">
        <img src={imagen} alt={nombre} className="repuesto-imagen" />

        <div className="card-section repuesto-info">
          <h3 className="repuesto-nombre">{nombre}</h3>
          <p className="repuesto-tipo">{tipo}</p>
          <p className="repuesto-marca">Marca: {marca}</p>
          <p className="repuesto-modelo">Modelo: {modelo}</p>
          <p className="repuesto-precio">${precio}</p>

          <span className={`repuesto-disponible ${disponible ? "en-stock" : "agotado"}`}>
            {disponible ? "Disponible" : "Agotado"}
          </span>

          <button
            className={`button repuesto-btn ${!disponible ? "disabled" : ""}`}
            disabled={!disponible}
          >
            {disponible ? "Ver más" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepuestoCard;