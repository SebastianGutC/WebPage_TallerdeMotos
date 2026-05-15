import { useEffect, useState } from "react";
import RepuestoCard from "../../components/Repuestos/RepuestoCard/RepuestoCard";
import RepuestoModal from "../../components/Repuestos/RepuestoModal/RepuestoModal";
import MenuFiltrar from "../../components/Repuestos/MenuFiltrar/MenuFiltrar";
import "foundation-sites/dist/css/foundation.min.css";
import HeroSection from "../../components/Repuestos/HeroSection/HeroSection";
import "./Repuestos.css";
import { getProductos} from "../../services/ProductosService";
import { useAuth } from "../../context/UseAuth";

const Repuestos = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
  const [itemsVisibles, setItemsVisibles] = useState(12);
  const [repuestos, setRepuestos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const { isAuthenticated, openLoginModal } = useAuth();

  const [filtros, setFiltros] = useState({
    marca: "",
    categoria: "",
    precioMin: null,
    precioMax: null,
    soloDisponibles: false,
  });

  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const res = await getProductos();
        setRepuestos(res.data);
      } catch (error) {
        console.error("Error fetching repuestos:", error);
      }
    };
    fetchRepuestos();
  }, []);

  // ✅ Búsqueda dinámica: se actualiza al escribir/borrar
  const repuestosFiltrados = repuestos
    .filter((r) => {
      const coincideMarca = !filtros.marca || r.marca === filtros.marca;
      const coincideCategoria = !filtros.categoria || r.categoria === filtros.categoria;
      const coincidePrecioMin = !filtros.precioMin || r.precio >= filtros.precioMin;
      const coincidePrecioMax = !filtros.precioMax || r.precio <= filtros.precioMax;
      const coincideDisponibles = !filtros.soloDisponibles || r.stock > 0;

      // ✅ Busca en nombre, marca y categoría
      const coincideNombre =
        !busqueda ||
        r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.categoria?.toLowerCase().includes(busqueda.toLowerCase());

      return (
        coincideMarca &&
        coincideCategoria &&
        coincidePrecioMin &&
        coincidePrecioMax &&
        coincideDisponibles &&
        coincideNombre
      );
    })
    .sort((a, b) => (b.stock > 0) - (a.stock > 0)); // disponibles primero

  const repuestosParaMostrar = repuestosFiltrados.slice(0, itemsVisibles);

  const cargarMas = () => setItemsVisibles((prev) => prev + 12);

  return (
    <section className="repuestos-section">
      <HeroSection />

      <div className="grid-container" id="catalogo-repuestos">
        <div className="titulo-repuestos text-center">
          <h2>Catálogo de Repuestos</h2>
        </div>

        <div className="grid-x grid-margin-x">
          <div className="cell small-12 medium-4 large-3">
            <MenuFiltrar
              filtros={filtros}
              repuestos={repuestos}
              onFiltroChange={(f) => {
                setFiltros(f);
                setItemsVisibles(12);
              }}
            />
          </div>

          <div className="cell small-12 medium-8 large-9">
            <div className={`barra-busqueda ${isFocused ? "focused" : ""}`}>
              <input
                type="text"
                placeholder="¿Qué necesita tu moto?"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value); // ✅ dinámico, sin botón
                  setItemsVisibles(12);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {/* botón opcional para limpiar */}
              {busqueda && (
                <button onClick={() => setBusqueda("")}>
                  <i className="fi-x"></i>
                </button>
              )}
            </div>

            <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
              {repuestosParaMostrar.length > 0 ? (
                repuestosParaMostrar.map((rep) => (
                  <div className="cell" key={rep._id}>
                    <RepuestoCard
                      {...rep}
                      onClick={() => setRepuestoSeleccionado(rep)}
                      isAuthenticated={isAuthenticated}
                      openLoginModal={openLoginModal}
                    />
                  </div>
                ))
              ) : (
                <div className="cell small-12 text-center">
                  <p>No se encontraron repuestos.</p>
                </div>
              )}
            </div>

            {itemsVisibles < repuestosFiltrados.length && (
              <button className="btn-ver-mas" onClick={cargarMas}>
                VER MÁS REPUESTOS
              </button>
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
    </section>
  );
};

export default Repuestos;