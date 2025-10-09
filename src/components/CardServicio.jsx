import React from "react";
import "foundation-sites/dist/css/foundation.min.css";

const CardServicio = ({ titulo, descripcion, icono, precio }) => {
  return (
    <div className="cell small-12 medium-6 large-4">
      <div className="card text-center" style={{ padding: "1rem", minHeight: "100%", boxShadow: "10px 15px 10px rgba(0, 0, 0, 0.1)", borderRadius: "30px" }}>
        <div className="card-divider"  style={{ backgroundColor: "transparent", border: "none" }}>
          <div style={{            
            backgroundColor:"rgba(255, 234, 174, 0.8)",
              borderRadius:"18px",
              width:"55px",
              height:"55px",
              alignContent:"center",}}>
                <i
            className={icono}
            style={{
              fontSize: "30px",
              color: "black",
              width:"fit-content",
              height:"fit-content",
            }}
          ></i>
            </div>
              <h4 style={{alignContent:"center", margin:"0 auto", fontWeight:"bold", justifyContent:"right", fontSize:"20px"}}>{titulo}</h4>
        </div>
        <div className="card-section">
          <p style={{fontSize:"19px"}}> {descripcion}</p>
          <p style={{ fontWeight: "bolder", color: "#FF8200", marginTop: "0.5rem", fontSize:"20px" }}>
            ${(precio.toLocaleString("es-CO"))}
          </p>
          <button
            className="button"
            style={{ backgroundColor: "#FFC100", color: "black", marginTop: "1rem", fontWeight: "bolder", borderRadius: "20px", border:"2px black solid", fontSize:"15px"}}
            onClick={() => alert(`Has seleccionado el servicio: ${titulo}`)}
          >
            Solicitar Servicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardServicio;

