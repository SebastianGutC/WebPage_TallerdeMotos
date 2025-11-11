import React, { useEffect, useRef, useState } from "react";
import "./ProductsCard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import AceiteMotul from "../../../assets/RepuestosImg/AceiteMotul.png";
import AceiteMotor from "../../../assets/RepuestosImg/aceite_motor_mobil.png";
import TapasLaterales from "../../../assets/RepuestosImg/TapasLateralesNKD125.png";
import EspejosNaked from "../../../assets/RepuestosImg/EspejosNaked.png";
import BateriaYuasa from "../../../assets/RepuestosImg/BateriaYuasa.png";
import FiltroAire from "../../../assets/RepuestosImg/FiltroAireFZ150.png";

const products = [
  { id: 1, name: "Aceite Motul 7100", price: "50.000", sale:"45.900", image: AceiteMotul },
  { id: 2, name: "Aceite de Motor mobil 4T ULTRA 20W-50 Litro", price: "34.400", sale:"30.900" ,image: AceiteMotor },
  { id: 3, name: "Tapas Laterales AK 125 NKD", price: "38.900", sale: "34.550", image: TapasLaterales },
  { id: 4, name: "Espejos Laterales Rizoma naked", price: "120.000", sale: "115.550", image: EspejosNaked },
  { id: 5, name: "Batería Yuasa YTX7A-BS", price: "165.000", sale: "155.900", image: BateriaYuasa },
  { id: 6, name: "Filtro de Aire Yamaha", price: "48.000", sale: "44.00", image: FiltroAire },
];

const ANIM_DURATION = 550; // ms — mantener coherente con CSS

export default function ProductsCard() {
  const n = products.length;
  const [startIndex, setStartIndex] = useState(0); // índice del primer card visible
  const [visibleCount, setVisibleCount] = useState(4);
  const [animating, setAnimating] = useState(false);
  const [incomingIdx, setIncomingIdx] = useState(null); // índice global del producto entrante
  const timeoutRef = useRef(null);

  // responsive: calcular cuántas cards mostrar
  useEffect(() => {
    function updateVisible() {
      const w = window.innerWidth;
      if (w >= 1200) setVisibleCount(4);
      else if (w >= 1000) setVisibleCount(3);
      else if (w >= 700) setVisibleCount(2);
      else setVisibleCount(1);
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const next = () => {
    if (animating) return;
    const incoming = (startIndex + visibleCount) % n; // producto que entrará por la derecha
    setIncomingIdx(incoming);
    setAnimating(true);
    // actualizamos startIndex — la nueva ventana ya incluye incoming
    setStartIndex((s) => (s + 1) % n);

    timeoutRef.current = setTimeout(() => {
      setIncomingIdx(null);
      setAnimating(false);
    }, ANIM_DURATION);
  };

  const prev = () => {
    if (animating) return;
    const incoming = (startIndex - 1 + n) % n; // producto que entrará por la izquierda
    setIncomingIdx(incoming);
    setAnimating(true);
    setStartIndex((s) => (s - 1 + n) % n);

    timeoutRef.current = setTimeout(() => {
      setIncomingIdx(null);
      setAnimating(false);
    }, ANIM_DURATION);
  };

  // indices visibles en el orden en que se deben mostrar (wrap modular)
  const visibleIndices = Array.from({ length: visibleCount }, (_, i) => (startIndex + i) % n);

  return (
    <section className="products-slider">
      <h3 className="products-title">Productos Destacados</h3>

      <div className="slider-container">
        <button className="slider-btn prev" onClick={prev} disabled={animating} aria-label="Anterior">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>


        <div
          className="cards-wrapper"
          style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}
        >
          {visibleIndices.map((prodIdx) => {
            const p = products[prodIdx];
            const isIncoming = incomingIdx === prodIdx;
            return (
              <article key={p.id} className={`product-card ${isIncoming ? "incoming" : ""}`}>
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
            );
          })}
        </div>

        <button className="slider-btn next" onClick={next} disabled={animating} aria-label="Siguiente">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}
