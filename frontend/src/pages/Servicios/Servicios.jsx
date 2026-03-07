import servicios from "../../assets/js/DataServicios";
import CardServicio from "../../components/CardServicio/CardServicio";
import serviciosEnCurso from "../../assets/js/DataServiciosEnCurso";
import CardServicioEnCurso from "../../components/CardServicioEnCurso/cardServicioEnCurso";
import CardPasos from "../../components/CardPasos/CardPasos";
import "./servicios.css";

function Servicios() {
  return (
    <>
      {/* Banner principal */}
      <section className="banner-servicios">
        <h3 className="banner-titulo">
          Servicios profesionales <br /> <span>para tu moto</span>
          <br /><button className="link-catalogo" onClick={() => {
    document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
  }}>Conoce nuestro catálogo</button>

        </h3>
      </section>

      {/* Servicios en curso */}
      <section className="grid-container servicios-en-curso">
        <div className="grid-x grid-padding-x align-center text-center">
          <div className="cell small-12 medium-10 large-8">
            <h2 className="titulo-seccion">
              Hola <span className="text-gradient">Carlos Perez</span>
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

      <div className="contenedor-pasos">
        <CardPasos></CardPasos>
      </div>

      {/* Catálogo de servicios */}
      <section id ="servicios" className="grid-container contenedor-servicios">
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
            <div className="cell small-12 medium-6 large-4" key={servicio.id}>
              <CardServicio
                titulo={servicio.titulo}
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
