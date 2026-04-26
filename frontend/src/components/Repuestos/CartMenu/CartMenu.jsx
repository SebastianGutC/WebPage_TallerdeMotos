
import React, { useEffect } from "react";
import "./CartMenu.css";
import { useCart } from "../../../context/CartContext";
import { getImagenUrl } from "../../../services/ProductosService";

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

  //BLOQUEAR SCROLL DEL BODY CUANDO EL CARRITO ESTÁ ABIERTO
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/*OVERLAY OSCURECIDO */}
      <div className="cart-overlay" onClick={toggleCart}></div>

      {/* MENU DEL CARRITO */}
      <div className="cart-menu" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h5>Carrito de Compras</h5>
          <button className="close-btn" onClick={toggleCart}>
            <i className="fi-x"></i>
          </button>
        </div>

        <div className={`cart-items ${cartItems.length === 0 ? "no-scroll" : ""}`}>

          {cartItems.length === 0 ? (
            <p className="empty">Tu carrito está vacío</p>
          ) : (
            cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={getImagenUrl(item.imagen)} alt={item.nombre} className="cart-img" />

                <div className="cart-info">
                  <h6 className="cart-nombre">{item.nombre}</h6>

                  <div className="cart-precios">
                    {item.precioAntes && (
                      <p className="precio-antes">
                        ${item.precioAntes.toLocaleString("es-CO")}
                      </p>
                    )}
                    <p className="precio-ahora">
                      ${item.precio.toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="cart-bottom-row">
                    <div className="cart-controls">
                      <button onClick={() => decreaseQty(item.nombre)} className="qty-btn">–</button>
                      <span className="qty-number">{item.cantidad}</span>
                      <button onClick={() => increaseQty(item.nombre)} className="qty-btn increase-btn">+</button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.nombre)}
                    >
                      <i className="fi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <h5>Total: ${total.toLocaleString("es-CO")}</h5>
            <div className="cart-buttons">
              <button className="btn-finalizar">Finalizar Compra</button>
              <button className="btn-seguir" onClick={toggleCart}>
                Seguir Comprando
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default CartMenu;
