import servicios from "../assets/js/DataServicios";
import CardServicio from "../components/CardServicio";
import "../assets/css/serviciosStyles.css";

function Servicios() {
  return (
    
    <section className="grid-container">
      <div className="grid-x grid-margin-x grid-margin-y">
        {servicios.map(serv => (
          <CardServicio
            titulo={serv.getTitulo()}
            descripcion={serv.getDescripcion()}
            icono={serv.getIcono()}
            precio={serv.getPrecio()}
          />
        ))}
      </div>
    </section>
  );
}

export default Servicios;

