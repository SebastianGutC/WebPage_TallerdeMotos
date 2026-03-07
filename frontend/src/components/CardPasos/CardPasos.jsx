import React from "react";
import "./CardPasos.css";

const steps = [
  { number: 1, title: "Selecciona el servicio", text: "Elige el servicio que deseas realizar en tu moto.", color: "#ff0000" },
  { number: 2, title: "Agenda tu cita", text: "Selecciona el día y hora que más te convenga.", color: "#ff8200"  },
  { number: 3, title: "Confirma tu solicitud", text: "Revisa los detalles y confirma tu reserva.", color: "#ffc100" },
  { number: 4, title: "Disfruta el servicio", text: "Trae tu moto y deja el resto en manos de nuestros expertos.", color: "#ffea00" }
];

export default function CardPasos() {
  return (
    <section className="card-steps-section">
      <h3 className="card-steps-title">Te recordamos los pasos para solicitar un servicio</h3>
      <div className="card-steps-container grid-x grid-margin-x small-up-1 medium-up-3 large-up-5">
        {steps.map((step) => (
          <div key={step.number} className="cell">
            <div className="step-card">
              <div className="step-number" style={{backgroundColor:step.color}}>{step.number}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-text">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

