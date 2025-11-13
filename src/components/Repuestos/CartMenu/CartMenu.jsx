import React from "react";
import "./CartMenu.css";
import { useCart } from "../../../context/CartContext";

const CartMenu = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
    toggleCart,
    isCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-menu">
      <div className="cart-header">
        <h5>Carrito de Compras</h5>
        <button className="close-btn" onClick={toggleCart}>
          <i className="fi-x"></i>
        </button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty">Tu carrito está vacío</p>
        ) : (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.imagen} alt={item.nombre} className="cart-img" />
              <div className="cart-info">
                <h6>{item.nombre}</h6>
                <p>${item.precio.toLocaleString("es-CO")}</p>
                <div className="cart-controls">
                  <button onClick={() => decreaseQty(item.nombre)}>
                    <i className="fi-minus"></i>
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => increaseQty(item.nombre)}>
                    <i className="fi-plus"></i>
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.nombre)}
                  >
                    <i className="fi-x"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <h5>Total: ${total.toLocaleString("es-CO")}</h5>
        <div className="cart-buttons">
          <button className="btn-finalizar">Finalizar Compra</button>
          <button className="btn-seguir" onClick={toggleCart}>
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartMenu;
