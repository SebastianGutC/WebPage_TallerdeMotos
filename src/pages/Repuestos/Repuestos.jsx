import React, { useState } from "react";
import RepuestoCard from "../../components/Repuestos/RepuestoCard/RepuestoCard";
import RepuestoModal from "../../components/Repuestos/RepuestoModal/RepuestoModal";
import MenuFiltrar from "../../components/Repuestos/MenuFiltrar/MenuFiltrar";
import repuestos from "../../assets/js/DataRepuestos";
import "foundation-sites/dist/css/foundation.min.css";

const Repuestos = () => {
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    tipo: "",
    precioMin: "",
    precioMax: "",
    soloDisponibles: false,
  });


  const repuestosFiltrados = repuestos.filter((r) => {
    return (
      (!filtros.marca || r.marca === filtros.marca) &&
      (!filtros.modelo || r.modelo === filtros.modelo) &&
      (!filtros.tipo || r.tipo === filtros.tipo) &&
      (!filtros.precioMin || r.precio >= filtros.precioMin) &&
      (!filtros.precioMax || r.precio <= filtros.precioMax) &&
      (!filtros.soloDisponibles || r.disponible)
    );
  }).sort((a, b) => (b.disponible === a.disponible ? 0 : b.disponible ? 1 : -1));;

  return (
    <section className="repuestos-section">
      <div className="grid-container">
        <h2 className="text-center repuestos-titulo">Catálogo de repuestos</h2>

        <div className="grid-x grid-margin-x">

          <div className="cell small-12 medium-4 large-3">
            <MenuFiltrar filtros={filtros} onFiltroChange={setFiltros} />
          </div>


          <div className="cell small-12 medium-8 large-9">
            <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
              {repuestosFiltrados.map((rep, index) => (
                <div className="cell" key={index}>
                  <RepuestoCard {...rep} onClick={() => setRepuestoSeleccionado(rep)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {repuestoSeleccionado && (
          <RepuestoModal
            repuesto={repuestoSeleccionado}
            onClose={() => setRepuestoSeleccionado(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Repuestos;

