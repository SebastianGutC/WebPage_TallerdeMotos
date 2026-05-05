import React from "react";
import "./ModalExito.css";

export const ModalExito = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-bar">
          <div className="bar-red" />
          <div className="bar-orange" />
          <div className="bar-yellow" />
        </div>

        <div className="modal-body">
          <div className="modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <polyline
                points="20 6 9 17 4 12"
                stroke="#F0A903"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="modal-brand">MOTORFIX</p>
          <h2 className="modal-title">¡Compra exitosa!</h2>
          <p className="modal-desc">
            Tu pedido fue procesado correctamente.<br />
            Tu factura ha sido{" "}
            <span className="modal-highlight">generada y descargada</span>{" "}
            automáticamente.
          </p>

          <button className="modal-btn" onClick={onClose}>
            ACEPTAR
          </button>

          <p className="modal-thanks">¡Gracias por confiar en MOTORFIX!</p>
        </div>

        <div className="modal-bar">
          <div className="bar-red" />
          <div className="bar-orange" />
          <div className="bar-yellow" />
        </div>

      </div>
    </div>
  );
};