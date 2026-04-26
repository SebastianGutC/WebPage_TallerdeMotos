import React, { useMemo, useState } from "react";
import "./MenuFiltrar.css";
import CustomSelect from "./CustomSelect";

const MenuFiltrar = ({ filtros, onFiltroChange, repuestos = [] }) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Para resetear CustomSelect
  const filtrosVacios = {
    marca: "",
    categoria: "",
    precioMin: null,
    precioMax: null,
    soloDisponibles: false,
  };

  const limpiarFiltros = () => {
    setLocalFiltros(filtrosVacios);
    onFiltroChange(filtrosVacios);
    setResetKey((prev) => prev + 1); 
  };

  const hayFiltrosActivos =
    localFiltros.marca ||
    localFiltros.categoria ||
    localFiltros.precioMin ||
    localFiltros.precioMax ||
    localFiltros.soloDisponibles;

  const categorias = useMemo(
    () => [...new Set(repuestos.map((r) => r.categoria).filter(Boolean))],
    [repuestos],
  );

  const marcas = useMemo(() => {
    const base = filtros.categoria
      ? repuestos.filter((r) => r.categoria === filtros.categoria)
      : repuestos;
    return [...new Set(base.map((r) => r.marca).filter(Boolean))];
  }, [filtros.categoria, repuestos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...localFiltros,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "categoria") {
      newFilters.marca = "";
    }

    setLocalFiltros(newFilters);
    if (name !== "precioMin" && name !== "precioMax")
      onFiltroChange(newFilters);
  };

  const aplicarFiltroPrecio = () => onFiltroChange(localFiltros);

  const handleSliderChange = (e, target) => {
    const value = Number(e.target.value);
    let nuevosFiltros = { ...localFiltros };
    if (target === "min") {
      nuevosFiltros.precioMin = Math.min(
        value,
        localFiltros.precioMax || precioMaxDisponible,
      );
    } else {
      nuevosFiltros.precioMax = Math.max(
        value,
        localFiltros.precioMin || precioMinDisponible,
      );
    }
    setLocalFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  const repuestosFiltradosBase = useMemo(() => {
    return repuestos.filter((r) => {
      const coincideCategoria =
        !localFiltros.categoria || r.categoria === localFiltros.categoria;
      const coincideMarca =
        !localFiltros.marca || r.marca === localFiltros.marca;
      return coincideCategoria && coincideMarca;
    });
  }, [localFiltros.categoria, localFiltros.marca, repuestos]);

  const precioMinDisponible = useMemo(
    () =>
      repuestosFiltradosBase.length
        ? Math.min(...repuestosFiltradosBase.map((r) => r.precio))
        : 0,
    [repuestosFiltradosBase],
  );

  const precioMaxDisponible = useMemo(
    () =>
      repuestosFiltradosBase.length
        ? Math.max(...repuestosFiltradosBase.map((r) => r.precio))
        : 0,
    [repuestosFiltradosBase],
  );

  return (
    <>
      <button
        className="btn-toggle-filtros"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
      </button>

      <aside className={`menu-filtrar ${menuAbierto ? "open" : "closed"}`}>
        <h3 className="menu-filtrar-titulo">Filtrar repuestos</h3>
        {hayFiltrosActivos && (
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            ✕ Limpiar filtros
          </button>
        )}
        {/* ✅ Categoría en vez de Tipo */}
        <label>Categoría</label>
        <CustomSelect
          key={`categoria-${resetKey}`}
          placeholder="Todas"
          options={[
            { value: "", label: "Todas" },
            ...categorias.map((c) => ({ value: c, label: c })),
          ]}
          onChange={(opt) =>
            handleChange({ target: { name: "categoria", value: opt.value } })
          }
        />

        <label>Marca</label>
        <CustomSelect
          key={`marca-${resetKey}`}
          placeholder="Todas"
          options={[
            { value: "", label: "Todas" },
            ...marcas.map((m) => ({ value: m, label: m })),
          ]}
          onChange={(opt) =>
            handleChange({ target: { name: "marca", value: opt.value } })
          }
        />

        <div className="precio-filtro">
          <h4>Rango de Precio</h4>
          <div className="precio-inputs">
            <input
              type="text"
              name="precioMin"
              value={
                localFiltros.precioMin
                  ? Number(localFiltros.precioMin).toLocaleString("es-CO")
                  : ""
              }
              placeholder="$ Min"
              onChange={(e) =>
                setLocalFiltros({
                  ...localFiltros,
                  precioMin: e.target.value
                    .replace(/\./g, "")
                    .replace(/,/g, ""),
                })
              }
            />
            <input
              type="text"
              name="precioMax"
              value={
                localFiltros.precioMax
                  ? Number(localFiltros.precioMax).toLocaleString("es-CO")
                  : ""
              }
              placeholder="$ Max"
              onChange={(e) =>
                setLocalFiltros({
                  ...localFiltros,
                  precioMax: e.target.value
                    .replace(/\./g, "")
                    .replace(/,/g, ""),
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
              min={precioMinDisponible}
              max={precioMaxDisponible}
              value={localFiltros.precioMin || precioMinDisponible}
              className="rango-slider"
              onChange={(e) => handleSliderChange(e, "min")}
            />
            <input
              type="range"
              min={precioMinDisponible}
              max={precioMaxDisponible}
              value={localFiltros.precioMax || precioMaxDisponible}
              className="rango-slider"
              onChange={(e) => handleSliderChange(e, "max")}
            />
          </div>
        </div>

        <label className="checkbox-label">
          <span className="custom-checkbox">
            <input
              type="checkbox"
              name="soloDisponibles"
              checked={localFiltros.soloDisponibles}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
          </span>
          Solo disponibles
        </label>
      </aside>
    </>
  );
};

export default MenuFiltrar;
