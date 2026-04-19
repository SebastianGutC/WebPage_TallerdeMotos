import React, { useEffect, useRef } from "react";
import "./ProductsCard.css";
import gsap from "gsap";
import { useCart } from "../../../context/CartContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import AceiteMotul from "../../../assets/RepuestosImg/AceiteMotul.png";
import AceiteMotor from "../../../assets/RepuestosImg/aceite_motor_mobil.png";
import TapasLaterales from "../../../assets/RepuestosImg/TapasLateralesNKD125.png";
import EspejosNaked from "../../../assets/RepuestosImg/EspejosNaked.png";
import BateriaYuasa from "../../../assets/RepuestosImg/BateriaYuasa.png";
import FiltroAire from "../../../assets/RepuestosImg/FiltroAireFZ150.png";

const products = [
  { id: 1, name: "Aceite Motul 7100", price: "45.900", image: AceiteMotul, precio: 45900 },
  { id: 2, name: "Aceite Motor Mobil", price: "30.900", image: AceiteMotor, precio: 30900 },
  { id: 3, name: "Tapas Laterales NKD", price: "34.550", image: TapasLaterales, precio: 34550 },
  { id: 4, name: "Espejos Rizoma", price: "115.550", image: EspejosNaked, precio: 115550 },
  { id: 5, name: "Batería Yuasa", price: "155.900", image: BateriaYuasa, precio: 155900 },
  { id: 6, name: "Filtro Aire Yamaha", price: "44.000", image: FiltroAire, precio: 44000 },
];

const loopProducts = [...products, ...products];

const BASE_SPEED = 1.2;

export default function ProductsCard() {
  const sliderRef = useRef(null);
  const xRef = useRef(0);
  const widthRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const pausedRef = useRef(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const el = sliderRef.current;
    widthRef.current = el.scrollWidth / 2;

    const tick = () => {
      if (pausedRef.current) return;

      xRef.current -= speedRef.current;

      if (xRef.current <= -widthRef.current) {
        xRef.current += widthRef.current;
      }
      if (xRef.current > 0) {
        xRef.current -= widthRef.current;
      }

      gsap.set(el, { x: xRef.current });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

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
      imagen: p.image,
      nombre: p.name,
      precio: p.precio,
    });
  };

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
                <img src={p.image} alt={p.name} className="product-image" />
              </div>

              <h3 className="product-name">{p.name}</h3>

              <div className="product-details">
                <p className="product-price">${p.price}</p>

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