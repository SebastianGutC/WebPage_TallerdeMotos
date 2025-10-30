import React, { useMemo, useState } from "react";
import repuestos from "../../../assets/js/DataRepuestos";
import "./MenuFiltrar.css";

const MenuFiltrar = ({ filtros, onFiltroChange }) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);

  const marcas = useMemo(() => [...new Set(repuestos.map(r => r.marca))], []);
  const tipos = useMemo(() => [...new Set(repuestos.map(r => r.tipo))], []);
  const modelos = useMemo(() => [...new Set(repuestos.map(r => r.modelo))], []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFiltros({
      ...localFiltros,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Ejecuta el filtro solo cuando se presiona la lupa
  const aplicarFiltroPrecio = () => {
    onFiltroChange(localFiltros);
  };

  // ✅ Función para el slider
  const handleSliderChange = (e) => {
    const nuevoMax = e.target.value;
    const nuevosFiltros = { ...localFiltros, precioMax: nuevoMax };
    setLocalFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  return (
    <aside className="menu-filtrar">
      <h3 className="menu-filtrar-titulo">Filtrar repuestos</h3>

      <label>Marca</label>
      <select name="marca" value={localFiltros.marca} onChange={handleChange}>
        <option value="">Todas</option>
        {marcas.map((marca, i) => (
          <option key={i} value={marca}>{marca}</option>
        ))}
      </select>

      <label>Modelo</label>
      <select name="modelo" value={localFiltros.modelo} onChange={handleChange}>
        <option value="">Todos</option>
        {modelos.map((modelo, i) => (
          <option key={i} value={modelo}>{modelo}</option>
        ))}
      </select>

      <label>Tipo</label>
      <select name="tipo" value={localFiltros.tipo} onChange={handleChange}>
        <option value="">Todos</option>
        {tipos.map((tipo, i) => (
          <option key={i} value={tipo}>{tipo}</option>
        ))}
      </select>

      {/* Rango de Precios */}
      <div className="precio-filtro">
        <h4>Rango De Precios</h4>

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
            🔍
          </button>
        </div>

        <div className="precio-rango-textos">
          <span>Min.</span>
          <span>Max.</span>
        </div>

        {/* Slider funcionando */}
        <input
          type="range"
          min="0"
          max="1000000"
          value={localFiltros.precioMax || 0}
          className="rango-slider"
          onChange={handleSliderChange}
        />
      </div>

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
