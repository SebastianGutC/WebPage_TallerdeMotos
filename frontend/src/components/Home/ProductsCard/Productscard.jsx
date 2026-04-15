import React, { useEffect, useRef } from "react";
import "./ProductsCard.css";
import gsap from "gsap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import AceiteMotul from "../../../assets/RepuestosImg/AceiteMotul.png";
import AceiteMotor from "../../../assets/RepuestosImg/aceite_motor_mobil.png";
import TapasLaterales from "../../../assets/RepuestosImg/TapasLateralesNKD125.png";
import EspejosNaked from "../../../assets/RepuestosImg/EspejosNaked.png";
import BateriaYuasa from "../../../assets/RepuestosImg/BateriaYuasa.png";
import FiltroAire from "../../../assets/RepuestosImg/FiltroAireFZ150.png";

const products = [
  { id: 1, name: "Aceite Motul 7100", price: "50.000", sale:"45.900", image: AceiteMotul },
  { id: 2, name: "Aceite Motor Mobil", price: "34.400", sale:"30.900" ,image: AceiteMotor },
  { id: 3, name: "Tapas Laterales NKD", price: "38.900", sale: "34.550", image: TapasLaterales },
  { id: 4, name: "Espejos Rizoma", price: "120.000", sale: "115.550", image: EspejosNaked },
  { id: 5, name: "Batería Yuasa", price: "165.000", sale: "155.900", image: BateriaYuasa },
  { id: 6, name: "Filtro Aire Yamaha", price: "48.000", sale: "44.00", image: FiltroAire },
];

const loopProducts = [...products, ...products];

export default function ProductsCard() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const el = sliderRef.current;
    const totalWidth = el.scrollWidth / 2;

    const tl = gsap.to(el, {
      x: `-=${totalWidth}`,
      duration: 25,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });

    animationRef.current = tl;

    // pausa hover
    el.addEventListener("mouseenter", () => tl.pause());
    el.addEventListener("mouseleave", () => tl.resume());

    return () => tl.kill();
  }, []);

  const handleNext = () => {
    const tl = animationRef.current;
    tl.pause();
    tl.progress(tl.progress() + 0.1); // avanza en el loop
    tl.resume();
  };

  const handlePrev = () => {
    const tl = animationRef.current;
    tl.pause();
    tl.progress(tl.progress() - 0.1); // retrocede
    tl.resume();
  };

  return (
    <section className="products-slider">
      <h3 className="products-title">Productos Destacados</h3>

      <div className="slider-container">
        
        <button className="slider-btn prev" onClick={handlePrev}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="cards-track" ref={sliderRef}>
          {loopProducts.map((p, i) => (
            <article key={i} className="product-card">
              <div className="media">
                <img src={p.image} alt={p.name} className="product-image" />
              </div>

              <h3 className="product-name">{p.name}</h3>

              <div className="product-details">
                <p className="product-price">${p.price}</p>
                <p className="product-sale">${p.sale}</p>

                <button className="btn-add">
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <button className="slider-btn next" onClick={handleNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

      </div>
    </section>
  );
}