import React, { useMemo, useState } from "react";
import repuestos from "../../../assets/js/DataRepuestos";
import "./MenuFiltrar.css";

const MenuFiltrar = ({ filtros, onFiltroChange }) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);

  // 🔹 Tipos (siempre disponibles)
  const tipos = useMemo(() => [...new Set(repuestos.map(r => r.tipo))], []);

  // 🔹 Marcas dinámicas: dependen del tipo seleccionado
  const marcas = useMemo(() => {
    const repuestosFiltradosPorTipo = filtros.tipo
      ? repuestos.filter(r => r.tipo === filtros.tipo)
      : repuestos;

    return [...new Set(repuestosFiltradosPorTipo.map(r => r.marca))];
  }, [filtros.tipo]);

  // 🔹 Modelos dinámicos: dependen de la marca seleccionada
  const modelos = useMemo(() => {
    const repuestosFiltradosPorMarca = filtros.marca
      ? repuestos.filter(r => r.marca === filtros.marca)
      : repuestos;

    const modelosSeparados = repuestosFiltradosPorMarca.flatMap(r =>
      r.modelo.split(",").map(m => m.trim())
    );

    return [...new Set(modelosSeparados)];
  }, [filtros.marca]);

  // 🔹 Manejo de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = { ...localFiltros, [name]: type === "checkbox" ? checked : value };

    // Dependencias entre filtros
    if (name === "tipo") {
      newFilters.marca = "";
      newFilters.modelo = "";
    }
    if (name === "marca") {
      newFilters.modelo = "";
    }

    setLocalFiltros(newFilters);

    if (name !== "precioMin" && name !== "precioMax") {
      onFiltroChange(newFilters);
    }
  };

  // 🔹 Filtro de precio
  const aplicarFiltroPrecio = () => {
    onFiltroChange(localFiltros);
  };

  const handleSliderChange = (e, target) => {
    const value = Number(e.target.value);
    let nuevosFiltros = { ...localFiltros };

    if (target === "min") {
      nuevosFiltros.precioMin = value;
      if (value > Number(nuevosFiltros.precioMax)) {
        nuevosFiltros.precioMax = value;
      }
    } else {
      nuevosFiltros.precioMax = value;
      if (value < Number(nuevosFiltros.precioMin)) {
        nuevosFiltros.precioMin = value;
      }
    }

    setLocalFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  return (
    <aside className="menu-filtrar">
      <h3 className="menu-filtrar-titulo">Filtrar repuestos</h3>

      {/* Tipo */}
      <label>Tipo</label>
      <select name="tipo" value={localFiltros.tipo} onChange={handleChange}>
        <option value="">Todos</option>
        {tipos.map((tipo, i) => (
          <option key={i} value={tipo}>{tipo}</option>
        ))}
      </select>

      {/* Marca dependiente del tipo */}
      <label>Marca</label>
      <select
        name="marca"
        value={localFiltros.marca}
        onChange={handleChange}
        disabled={marcas.length === 0}
      >
        <option value="">Todas</option>
        {marcas.map((marca, i) => (
          <option key={i} value={marca}>{marca}</option>
        ))}
      </select>

      {/* Modelo dependiente de la marca */}
      <label>Modelo</label>
      <select
        name="modelo"
        value={localFiltros.modelo}
        onChange={handleChange}
        disabled={modelos.length === 0}
      >
        <option value="">Todos</option>
        {modelos.map((modelo, i) => (
          <option key={i} value={modelo}>{modelo}</option>
        ))}
      </select>

      {/* Rango de precios */}
      <div className="precio-filtro">
        <h4>Rango de Precio</h4>

        <div className="precio-inputs">
          <input
            type="text"
            name="precioMin"
            value={localFiltros.precioMin ? Number(localFiltros.precioMin).toLocaleString("es-CO") : ""}
            placeholder="$ Min"
            onChange={(e) =>
              setLocalFiltros({
                ...localFiltros,
                precioMin: e.target.value.replace(/\./g, "").replace(/,/g, "")
              })
            }
          />
          <input
            type="text"
            name="precioMax"
            value={localFiltros.precioMax ? Number(localFiltros.precioMax).toLocaleString("es-CO") : ""}
            placeholder="$ Max"
            onChange={(e) =>
              setLocalFiltros({
                ...localFiltros,
                precioMax: e.target.value.replace(/\./g, "").replace(/,/g, "")
              })
            }
          />
          <button className="buscar-precio-btn" onClick={aplicarFiltroPrecio}>
            <i className="fi-magnifying-glass"></i>
          </button>
        </div>

        <div className="sliders-container">
          <input
            type="range"
            min="0"
            max="1500000"
            value={localFiltros.precioMin || 0}
            className="rango-slider"
            onChange={(e) => handleSliderChange(e, "min")}
          />
          <input
            type="range"
            min="0"
            max="1500000"
            value={localFiltros.precioMax || 0}
            className="rango-slider"
            onChange={(e) => handleSliderChange(e, "max")}
          />
        </div>
      </div>

      {/* Solo disponibles */}
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="soloDisponibles"
          checked={localFiltros.soloDisponibles}
          onChange={handleChange}
        />
        Solo disponibles
      </label>
    </aside>
  );
};

export default MenuFiltrar;
