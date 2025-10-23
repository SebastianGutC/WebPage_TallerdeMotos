import React from "react";
import "./RepuestoCard.css";

const RepuestoCard = ({ imagen, nombre, precio, disponible, onClick }) => {
  return (
    <div className="cell small-12 medium-6 large-4">
      <div
        className="card repuesto-card equal-card"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="repuesto-imagen-container">
          <img src={imagen} alt={nombre} className="repuesto-imagen" loading="lazy" />
        </div>

        <div className="card-section repuesto-info">
          <div className="repuesto-textos">
            <h6 className="repuesto-nombre">{nombre}</h6>
            <h4 className="repuesto-precio">${precio}</h4>
          </div>


          <div className="repuesto-footer">
            <span
              className={`repuesto-disponible ${disponible ? "en-stock" : "agotado"}`}
            >
              {disponible ? "Disponible" : "Agotado"}
            </span>

            <button
              className={`button repuesto-btn ${!disponible ? "disabled" : ""}`}
              disabled={!disponible}
              onClick={(e) => e.stopPropagation()}
            >
              {disponible ? "Agregar al carrito" : "No disponible"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepuestoCard;

