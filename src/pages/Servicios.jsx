import servicios from "../assets/js/DataServicios";
import CardServicio from "../components/CardServicio";
import "../assets/css/serviciosStyles.css";

function Servicios() {
  return (

<div className="grid-container contenedor-servicios margin-top-5">
      <div className="grid-x grid-padding-x align-center text-center margin-bottom-2">
        <div className="cell small-12 medium-10 large-8 contenedor-catalogo">
          <h2 className="text-primary titulo-catalogo">Catálogo de Servicios</h2>
          <p className="lead texto-catalogo">
            En <strong style={{color:"#FF0000"}}>Motorfix</strong> ofrecemos los siguientes servicios.
            Los precios mostrados corresponden solo al costo del servicio; los repuestos se cobran por separado.
          </p>
        </div>
      </div>

      <div className="grid-x grid-margin-x grid-margin-y">
        {servicios.map((servicio) => (
          <CardServicio
            key={servicio.id}
            titulo={servicio.titulo}
            descripcion={servicio.descripcion}
            icono={servicio.icono}
            precio={servicio.precio}
          />
        ))}
      </div>
    </div>
  );
}

export default Servicios;

