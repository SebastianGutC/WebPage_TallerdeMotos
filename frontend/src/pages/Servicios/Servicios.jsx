import CardServicio from "../../components/CardServicio/CardServicio";
import serviciosEnCurso from "../../assets/js/DataServiciosEnCurso";
import CardServicioEnCurso from "../../components/CardServicioEnCurso/cardServicioEnCurso";
import CardPasos from "../../components/CardPasos/CardPasos";
import "./servicios.css";
import { getServicios } from "../../services/ServiciosService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const { usuario } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await getServicios();
        setServicios(res.data);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  useEffect(() => {
    if (location.hash === "#servicios") {
      setTimeout(() => {
        document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.hash === "#enCurso" &&
      usuario &&
      usuario.rol === "USUARIO"
    ) {
      setTimeout(() => {
        document
          .getElementById("enCurso")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    
  }, [location, usuario]);

  console.log("usuario context:", usuario);
  console.log("servicios:", servicios);
  return (
    <>
      {/* Banner principal */}
      <section className="banner-servicios">
        <h3 className="banner-titulo">
          Servicios profesionales <br /> <span>para tu moto</span>
          <br />
          <button
            className="link-catalogo"
            onClick={() => {
              document
                .getElementById("servicios")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Conoce nuestro catálogo
          </button>
        </h3>
      </section>

      {/* Servicios en curso */}
      {usuario && usuario.rol ==="USUARIO" && (
        <section id="enCurso" className="grid-container servicios-en-curso">
          <div className="grid-x grid-padding-x align-center text-center">
            <div className="cell small-12 medium-10 large-8">
              <h2 className="titulo-seccion">
                Hola <span className="text-gradient">{usuario.nombre}</span>
              </h2>

              <p className="subtitulo-seccion">
                Aquí puedes ver todos tus servicios, en curso y finalizados.
              </p>
            </div>
          </div>

          <div className="grid-x grid-margin-x grid-margin-y align-center">
            {serviciosEnCurso.map((servicioEnCurso) => (
              <div
                className="cell small-12 medium-6 large-4"
                key={servicioEnCurso.id}
              >
                <CardServicioEnCurso servicio={servicioEnCurso} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="contenedor-pasos">
        <CardPasos></CardPasos>
      </div>

      {/* Catálogo de servicios */}
      <section id="servicios" className="grid-container contenedor-servicios">
        <div className="grid-x grid-padding-x align-center text-center margin-bottom-2">
          <div className="cell small-12 medium-10 large-8 contenedor-catalogo">
            <h2 className="text-primary titulo-catalogo">
              Catálogo de Servicios
            </h2>
            <p className="lead subtitulo-seccion text-left">
              En <strong className="texto-rojo">Motorfix</strong> ofrecemos los
              siguientes servicios. Los precios mostrados corresponden solo al
              costo del servicio, los repuestos se cobran por separado.
            </p>
          </div>
        </div>

        <div className="grid-x grid-margin-x grid-margin-y align-center">
          {servicios.map((servicio) => (
            <div className="cell small-12 medium-6 large-4" key={servicio._id}>
              <CardServicio
                nombre={servicio.nombre}
                descripcion={servicio.descripcion}
                icono={servicio.icono}
                precio={servicio.precio}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Servicios;
