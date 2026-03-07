import React, { useState } from "react";
import RepuestoCard from "../../components/Repuestos/RepuestoCard/RepuestoCard";
import RepuestoModal from "../../components/Repuestos/RepuestoModal/RepuestoModal";
import MenuFiltrar from "../../components/Repuestos/MenuFiltrar/MenuFiltrar";
import repuestos from "../../assets/js/DataRepuestos";
import "foundation-sites/dist/css/foundation.min.css";
import HeroSection from "../../components/Repuestos/HeroSection/HeroSection";
import styled from "styled-components";

const RepuestosSection = styled.section`
  margin-bottom: 4rem;
`;

const TituloRepuestos = styled.section`
  margin-top: 1rem;
  margin-bottom: 2rem;
  h2 {
    font-weight: 700;
    margin-top: 0;
  }
`;

const BarraBusquedaWrapper = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  width: 100%;

  input {
    flex: 1;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid ${(props) => (props.focused ? "#000" : "#fff")};
    border-radius: 50px 0 0 50px;
    outline: none;
    height: 2.5rem;
  }

  button {
    background-color: #FFEAAE;
    color: #111;
    border: 1px solid ${(props) => (props.focused ? "#000" : "#fff")};
    border-left: none;
    border-radius: 0 50px 50px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      background-color: #ffc100;
    }

    i {
      margin: 0;
      font-size: 1.2rem;
    }
  }
`;

const BotonVerMas = styled.button`
  background-color: #c0c0c0ff;
  color: #f5f5f5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  border-radius: 30px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  margin-top: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;

  &:hover {
    background: linear-gradient(to right, #FF0000, #FF8200, #FFC100);
    color: #fff;
    transform: scale(1.05);
  }
`;


const Repuestos = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
  const [itemsVisibles, setItemsVisibles] = useState(12);

  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    tipo: "",
    precioMin: null,
    precioMax: null,
    soloDisponibles: false,
  });

  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const repuestosFiltrados = repuestos
    .filter((r) => {
      const coincideMarca = !filtros.marca || r.marca === filtros.marca;
      const coincideModelo =
        !filtros.modelo ||
        r.modelo.split(",").map((m) => m.trim()).includes(filtros.modelo);
      const coincideTipo = !filtros.tipo || r.tipo === filtros.tipo;
      const coincidePrecioMin = !filtros.precioMin || r.precio >= filtros.precioMin;
      const coincidePrecioMax = !filtros.precioMax || r.precio <= filtros.precioMax;
      const coincideDisponibilidad = !filtros.soloDisponibles || r.disponible;
      const coincideNombre =
        !busqueda || r.nombre.toLowerCase().includes(busqueda.toLowerCase());

      return (
        coincideMarca &&
        coincideModelo &&
        coincideTipo &&
        coincidePrecioMin &&
        coincidePrecioMax &&
        coincideDisponibilidad &&
        coincideNombre
      );
    })
    .sort((a, b) => (b.disponible === a.disponible ? 0 : b.disponible ? 1 : -1));

  // Aplica búsqueda
  const aplicarBusqueda = () => {
    setBusqueda(busquedaInput);
    setItemsVisibles(12); // reinicia el contador al buscar
  };

  // Mostrar solo los necesarios
  const repuestosParaMostrar = repuestosFiltrados.slice(0, itemsVisibles);

  // Cargar más
  const cargarMas = () => {
    setItemsVisibles((prev) => prev + 12);
  };

  return (
    <RepuestosSection>
      <HeroSection />

      <div className="grid-container">
        <TituloRepuestos id="catalogo-repuestos" className="text-center">
          <h2>Catálogo de Repuestos</h2>
        </TituloRepuestos>

        <div className="grid-x grid-margin-x">
          <div className="cell small-12 medium-4 large-3">
            <MenuFiltrar
              filtros={filtros}
              onFiltroChange={(f) => {
                setFiltros(f);
                setItemsVisibles(12);
              }}
            />
          </div>

          <div className="cell small-12 medium-8 large-9">
            <BarraBusquedaWrapper focused={isFocused}>
              <input
                type="text"
                placeholder="¿Qué necesita tu moto?"
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && aplicarBusqueda()}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button onClick={aplicarBusqueda}>
                <i className="fi-magnifying-glass"></i>
              </button>
            </BarraBusquedaWrapper>

            <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
              {repuestosParaMostrar.map((rep, index) => (
                <div className="cell" key={index}>
                  <RepuestoCard
                    {...rep}
                    onClick={() => setRepuestoSeleccionado(rep)}
                  />
                </div>
              ))}
            </div>

            {/* BOTÓN VER MÁS REPUESTOS */}
            {itemsVisibles < repuestosFiltrados.length && (
              <BotonVerMas onClick={cargarMas}>VER MÁS REPUESTOS</BotonVerMas>
            )}
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
