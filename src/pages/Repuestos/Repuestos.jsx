import React from "react";
import RepuestoCard from "../../components/Repuestos/RepuestoCard/RepuestoCard";
import repuestos from "../../assets/js/DataRepuestos";
import "foundation-sites/dist/css/foundation.min.css";


const Repuestos = () => {
  return (
    <section className="repuestos-section">
      <div className="grid-container">
        <h2 className="text-center repuestos-titulo">Catálogo de Repuestos</h2>

        <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
          {repuestos.map((rep, index) => (
            <div className="cell" key={index}>
              <RepuestoCard {...rep} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Repuestos;



