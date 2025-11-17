import React, { useMemo, useState } from "react";
import repuestos from "../../../assets/js/DataRepuestos";
import "./MenuFiltrar.css";
import CustomSelect from "./CustomSelect";

const MenuFiltrar = ({ filtros, onFiltroChange }) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);

  // 👇 Nuevo estado para móviles
  const [menuAbierto, setMenuAbierto] = useState(false);

  const tipos = useMemo(() => [...new Set(repuestos.map(r => r.tipo))], []);

  const marcas = useMemo(() => {
    const repuestosFiltradosPorTipo = filtros.tipo
      ? repuestos.filter(r => r.tipo === filtros.tipo)
      : repuestos;
    return [...new Set(repuestosFiltradosPorTipo.map(r => r.marca))];
  }, [filtros.tipo]);

  const modelos = useMemo(() => {
    const repuestosFiltradosPorMarca = filtros.marca
      ? repuestos.filter(r => r.marca === filtros.marca)
      : repuestos;

    const modelosSeparados = repuestosFiltradosPorMarca.flatMap(r =>
      r.modelo.split(",").map(m => m.trim())
    );

    return [...new Set(modelosSeparados)];
  }, [filtros.marca]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = { ...localFiltros, [name]: type === "checkbox" ? checked : value };

    if (name === "tipo") {
      newFilters.marca = "";
      newFilters.modelo = "";
      newFilters.precioMin = 0;
      newFilters.precioMax = 0;
    }
    if (name === "marca") {
      newFilters.modelo = "";
      newFilters.precioMin = 0;
      newFilters.precioMax = 0;
    }

    setLocalFiltros(newFilters);
    if (name !== "precioMin" && name !== "precioMax") onFiltroChange(newFilters);
  };

  const aplicarFiltroPrecio = () => onFiltroChange(localFiltros);

  const handleSliderChange = (e, target) => {
    const value = Number(e.target.value);

    const precioMinActual = localFiltros.precioMin ?? precioMinDisponible;
    const precioMaxActual = localFiltros.precioMax ?? precioMaxDisponible;

    let nuevosFiltros = { ...localFiltros };

    if (target === "min") {
      nuevosFiltros.precioMin = Math.min(value, precioMaxActual);
    } else {
      nuevosFiltros.precioMax = Math.max(value, precioMinActual);
    }

    setLocalFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  const repuestosFiltradosBase = useMemo(() => {
    return repuestos.filter(r => {
      const coincideTipo = !localFiltros.tipo || r.tipo === localFiltros.tipo;
      const coincideMarca = !localFiltros.marca || r.marca === localFiltros.marca;
      const coincideModelo =
        !localFiltros.modelo ||
        r.modelo.split(",").map(m => m.trim()).includes(localFiltros.modelo);
      return coincideTipo && coincideMarca && coincideModelo;
    });
  }, [localFiltros.tipo, localFiltros.marca, localFiltros.modelo]);

  const precioMinDisponible = useMemo(() => {
    if (repuestosFiltradosBase.length === 0) return 0;
    return Math.min(...repuestosFiltradosBase.map(r => r.precio));
  }, [repuestosFiltradosBase]);

  const precioMaxDisponible = useMemo(() => {
    if (repuestosFiltradosBase.length === 0) return 0;
    return Math.max(...repuestosFiltradosBase.map(r => r.precio));
  }, [repuestosFiltradosBase]);


  return (
    <>
      {/* 🔘 BOTÓN SOLO PARA MÓVILES */}
      <button
        className="btn-toggle-filtros"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
      </button>

      {/* ⬇ Mostrar/ocultar en móviles mediante clase */}
      <aside className={`menu-filtrar ${menuAbierto ? "open" : "closed"}`}>
        <h3 className="menu-filtrar-titulo">Filtrar repuestos</h3>

        {/* Tu contenido original */}
        {/* ---------------------------------------- */}
        <label>Tipo</label>
        <CustomSelect
          placeholder="Todos"
          options={[
            { value: "", label: "Todos" },
            ...tipos.map(t => ({ value: t, label: t }))
          ]}
          onChange={(opt) =>
            handleChange({ target: { name: "tipo", value: opt.value } })
          }
        />
        <label>Marca</label>
        <CustomSelect
          placeholder="Todas"
          options={[
            { value: "", label: "Todas" },
            ...marcas.map(m => ({ value: m, label: m }))
          ]}
          onChange={(opt) =>
            handleChange({ target: { name: "marca", value: opt.value } })
          }
        />
        <label>Modelo</label>
        <CustomSelect
          placeholder="Todos"
          options={[
            { value: "", label: "Todos" },
            ...modelos.map(m => ({ value: m, label: m }))
          ]}
          onChange={(opt) =>
            handleChange({ target: { name: "modelo", value: opt.value } })
          }
        />

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
          <input
            type="checkbox"
            name="soloDisponibles"
            checked={localFiltros.soloDisponibles}
            onChange={handleChange}
          />
          Solo disponibles
        </label>
      </aside>
    </>
  );
};

export default MenuFiltrar;
