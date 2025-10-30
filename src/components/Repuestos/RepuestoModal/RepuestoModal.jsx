import React from "react";
import "./RepuestoModal.css";

const RepuestoModal = ({ repuesto, onClose }) => {
  if (!repuesto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-imagen-container">
          <img src={repuesto.imagen} alt={repuesto.nombre} className="modal-imagen" />
        </div>

        <h3 className="modal-nombre">{repuesto.nombre}</h3>
        <p className="modal-tipo">{repuesto.tipo}</p>
        <p className="modal-marca">Marca: {repuesto.marca}</p>
        <p className="modal-modelo">Modelo: {repuesto.modelo}</p>
        <p className="modal-precio">${repuesto.precio.toLocaleString("es-CO")}</p>
        <p className="modal-descripcion">{repuesto.descripcion}</p>
      </div>
    </div>
  );
};

export default RepuestoModal;