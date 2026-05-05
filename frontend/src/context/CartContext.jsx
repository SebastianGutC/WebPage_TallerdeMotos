import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.nombre === product.nombre);
      if (existing) {
        return prev.map((item) =>
          item.nombre === product.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (nombre) =>
    setCartItems((prev) => prev.filter((item) => item.nombre !== nombre));

  const increaseQty = (nombre) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.nombre === nombre
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );

  const decreaseQty = (nombre) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.nombre === nombre && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );

  const total = cartItems.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const vaciarCarrito = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total,
        isCartOpen,
        toggleCart,
        vaciarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
