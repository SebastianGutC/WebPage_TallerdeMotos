import React, { useMemo, useState } from "react";
import repuestos from "../../../assets/js/DataRepuestos";
import "./MenuFiltrar.css";

const MenuFiltrar = ({ filtros, onFiltroChange }) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);

  // 🔹 Se generan listas únicas dinámicamente desde los datos actuales
  const marcas = useMemo(() => [...new Set(repuestos.map(r => r.marca))], []);
  const tipos = useMemo(() => [...new Set(repuestos.map(r => r.tipo))], []);
  const modelos = useMemo(() => [...new Set(repuestos.map(r => r.modelo))], []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevosFiltros = {
      ...localFiltros,
      [name]: type === "checkbox" ? checked : value,
    };
    setLocalFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  return (
    <aside className="menu-filtrar">
      <h3 className="menu-filtrar-titulo">Filtrar repuestos</h3>

      {/* Marca */}
      <label>Marca</label>
      <select name="marca" value={localFiltros.marca} onChange={handleChange}>
        <option value="">Todas</option>
        {marcas.map((marca, i) => (
          <option key={i} value={marca}>{marca}</option>
        ))}
      </select>

      {/* Modelo */}
      <label>Modelo</label>
      <select name="modelo" value={localFiltros.modelo} onChange={handleChange}>
        <option value="">Todos</option>
        {modelos.map((modelo, i) => (
          <option key={i} value={modelo}>{modelo}</option>
        ))}
      </select>

      {/* Tipo */}
      <label>Tipo</label>
      <select name="tipo" value={localFiltros.tipo} onChange={handleChange}>
        <option value="">Todos</option>
        {tipos.map((tipo, i) => (
          <option key={i} value={tipo}>{tipo}</option>
        ))}
      </select>

      {/* Precio */}
      <label>Precio mínimo</label>
      <input
        type="number"
        name="precioMin"
        value={localFiltros.precioMin}
        placeholder="Desde..."
        onChange={handleChange}
      />

      <label>Precio máximo</label>
      <input
        type="number"
        name="precioMax"
        value={localFiltros.precioMax}
        placeholder="Hasta..."
        onChange={handleChange}
      />

      {/* Disponibilidad */}
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
