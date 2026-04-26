import React from "react";
import "./RepuestoModal.css";
import { getImagenUrl } from "../../../services/ProductosService";

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
          <img src={getImagenUrl(repuesto.imagen)} alt={repuesto.nombre} className="modal-imagen" />
        </div>

        <h3 className="modal-nombre">{repuesto.nombre}</h3>
        <p className="modal-tipo">{repuesto.categoria}</p>
        <p className="modal-marca">Marca: {repuesto.marca}</p>
        <p className="modal-modelo">Modelo: {repuesto.modelo}</p>
        <h4 className="modal-precio">${repuesto.precio.toLocaleString("es-CO")}</h4>
        <p className="modal-descripcion">{repuesto.descripcion}</p>
      </div>
    </div>
  );
};

export default RepuestoModal;