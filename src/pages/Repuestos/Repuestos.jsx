import React, { useState } from "react";
import RepuestoCard from "../../components/Repuestos/RepuestoCard/RepuestoCard";
import RepuestoModal from "../../components/Repuestos/RepuestoModal/RepuestoModal";
import MenuFiltrar from "../../components/Repuestos/MenuFiltrar/MenuFiltrar";
import repuestos from "../../assets/js/DataRepuestos";
import "foundation-sites/dist/css/foundation.min.css";
import HeroSection from "../../components/Repuestos/HeroSection/HeroSection"
import styled from "styled-components";



const RepuestosSection = styled.section`
  margin-bottom: 4rem; /* espacio entre el contenido y el footer */
`;


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


const repuestosFiltrados = repuestos
  .filter((r) => {
    const coincideMarca = !filtros.marca || r.marca === filtros.marca;

    //Permite coincidencias parciales en modelo
    const coincideModelo =
      !filtros.modelo ||
      r.modelo
        .split(",")                // divide los modelos múltiples
        .map((m) => m.trim())      // limpia espacios
        .includes(filtros.modelo); // verifica si contiene el modelo seleccionado

    const coincideTipo = !filtros.tipo || r.tipo === filtros.tipo;
    const coincidePrecioMin = !filtros.precioMin || r.precio >= filtros.precioMin;
    const coincidePrecioMax = !filtros.precioMax || r.precio <= filtros.precioMax;
    const coincideDisponibilidad = !filtros.soloDisponibles || r.disponible;

    return (
      coincideMarca &&
      coincideModelo &&
      coincideTipo &&
      coincidePrecioMin &&
      coincidePrecioMax &&
      coincideDisponibilidad
    );
  })
  //Mostrar disponibles primero
  .sort((a, b) =>
    b.disponible === a.disponible ? 0 : b.disponible ? 1 : -1
  );


  return (
  <RepuestosSection>
    <HeroSection />  {/* Hero fuera del grid-container */}

    <div className="grid-container">
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
  </RepuestosSection>

  );
};

export default Repuestos;

