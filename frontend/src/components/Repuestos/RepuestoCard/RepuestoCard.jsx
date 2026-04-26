import React from "react";
import "./RepuestoCard.css";
import { useCart } from "../../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { getImagenUrl } from "../../../services/ProductosService";

const RepuestoCard = ({ imagen, nombre, precio, stock, onClick, isAuthenticated, openLoginModal }) => {
  const { addToCart, toggleCart } = useCart();
  const disponible = stock > 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    addToCart({ imagen, nombre, precio });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    addToCart({ imagen, nombre, precio });
    toggleCart();
  };

  return (
    <div className="cell small-12 medium-6 large-4">
      <div
        className={`card repuesto-card equal-card ${!disponible ? "no-disponible" : ""}`}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="repuesto-imagen-container">
          <img
            src={getImagenUrl(imagen)}
            alt={nombre}
            className="repuesto-imagen"
            loading="lazy"
          />
        </div>

        <div className="card-section repuesto-info">
          <div className="repuesto-textos">
            <h6 className="repuesto-nombre">{nombre}</h6>
            <h4 className="repuesto-precio">
              ${precio.toLocaleString("es-CO")}
            </h4>
          </div>

          <div className="repuesto-footer">
            <div className="repuesto-botones-fila">

              <button
                className={`repuesto-btn-icon ${!disponible ? "disabled" : ""}`}
                disabled={!disponible}
                onClick={handleAdd}
              >
                <FontAwesomeIcon icon={faCartPlus} />
              </button>

              <button
                className={`repuesto-btn ${!disponible ? "disabled" : ""}`}
                disabled={!disponible}
                onClick={handleBuyNow}
              >
                Comprar ahora
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepuestoCard;

