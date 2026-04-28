import React, { useEffect, useRef, useState } from "react";
import "./ProductsCard.css";
import gsap from "gsap";
import { useCart } from "../../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getProductos } from "../../../services/ProductosService";
import { getImagenUrl } from "../../../services/ProductosService";

const BASE_SPEED = 1.2;

export default function ProductsCard() {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);
  const xRef = useRef(0);
  const widthRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const pausedRef = useRef(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await getProductos();
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
  if (products.length > 0) {
    console.log("primer producto:", products[0]);
    console.log("imagen:", products[0].imagen);
  }
}, [products]);

  const loopProducts = [...products, ...products];

  useEffect(() => {
    if (products.length === 0) return;
    const el = sliderRef.current;
    widthRef.current = el.scrollWidth / 2;

    const tick = () => {
      if (pausedRef.current) return;
      xRef.current -= speedRef.current;
      if (xRef.current <= -widthRef.current) xRef.current += widthRef.current;
      if (xRef.current > 0) xRef.current -= widthRef.current;
      gsap.set(el, { x: xRef.current });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [products]); 

  const move = (direction) => {
    const impulse = direction * 8;
    speedRef.current = BASE_SPEED + impulse;
    gsap.to(speedRef, {
      current: BASE_SPEED,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handleAdd = (e, p) => {
    e.stopPropagation();
    addToCart({
      imagen: p.imagen,
      nombre: p.nombre,
      precio: p.precio,
    });
  };

  if (products.length === 0) return null; 

  return (
    <section className="products-slider">
      <h3 className="products-title">Productos Destacados</h3>

      <div className="slider-container">
        <button className="slider-btn prev" onClick={() => move(-4)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="cards-track" ref={sliderRef}>
          {loopProducts.map((p, i) => (
            <article
              key={i}
              className="product-card"
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={() => { pausedRef.current = false; }}
            >
              <div className="media">
                <img
                  src={getImagenUrl(p.imagen)} 
                  alt={p.nombre}
                  className="product-image"
                />
              </div>

              <h3 className="product-name">{p.nombre}</h3>

              <div className="product-details">
                <p className="product-price">
                  ${p.precio.toLocaleString("es-CO")} 
                </p>
                <button className="btn-add" onClick={(e) => handleAdd(e, p)}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <button className="slider-btn next" onClick={() => move(4)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}