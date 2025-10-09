import React from "react";
import { useState } from "react";

function CardServicioEnCurso({ servicio }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="card radius shadow servicios-en-curso"
      style={{
        marginBottom: "1rem",
        minHeight: "100%",
        borderRadius: "20px",
        backgroundColor: "#FFEAAE",
      }}
    >
      <div
        className="card-divider"
        style={{
          backgroundColor: "#FF8200",
          color: "white",
          fontWeight: "bold",
        }}
        onClick={() => setVisible(!visible)}
      >
        <strong>{servicio.cliente}</strong> — {servicio.estado}
      </div>

      {visible && (
        <div
          className="card-section"
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "1rem",
            justifyContent: "space-between",
          }}
        >
          <div className="izquierda" style={{ width: "30%" }}>
            <p>
              <strong>Moto:</strong> {servicio.moto}
            </p>
            <p>
              <strong>Empleado encargado:</strong> {servicio.empleado}
            </p>
            <p>
              <strong>Fecha ingreso:</strong> {servicio.fechaIngreso}
            </p>
            <p>
              <strong>Fecha entrega:</strong> {servicio.fechaEntrega}
            </p>
            <p className="text-left" style={{ marginTop: "40%", fontWeight:"bold", alignItems:"center"}}>
              {" "}
              Valor a Pagar:{" "}
              <strong style={{ color: "#FF0000" }}>
                ${servicio.getTotal().toLocaleString()}
              </strong>
            </p>
            <button
                className="button"
                style={{
                  backgroundColor: "#FFC100",
                  color: "black",
                  fontWeight: "bolder",
                  borderRadius: "20px",
                  border: "2px black solid",
                  marginLeft: "30px",
                  float:"right"
                }}
              >
                Pagar
              </button>
          </div>

          <div className="derecha" style={{ marginLeft: "1rem", width: "80%" }}>
            <h6 className="text-center" style={{ fontWeight: "bold" }}>
              Repuestos usados
            </h6>
            <table
              className="unstriped"
              style={{
                boxShadow: "10px 15px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "25px",
                marginBottom: "1rem",
              }}
            >
              <thead style={{ backgroundColor: "#FFC100", color: "#0A0903" }}>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {servicio.repuestosUsados.map((r, i) => (
                  <tr key={i}>
                    <td>{r.repuesto.getNombre()}</td>
                    <td>{r.cantidad}</td>
                    <td>${r.repuesto.getPrecio().toLocaleString()}</td>
                    <td>${r.getSubtotal().toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3">
                    <strong>Total Repuestos</strong>
                  </td>
                  <td>${servicio.getTotalRepuestos().toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <table className="unstriped">
              <tbody>
                <tr>
                  <td colSpan="2">
                    <p>
                      <strong>Servicio </strong>
                    </p>
                  </td>
                  <td colSpan="2"> {servicio.servicio.getTitulo()}</td>
                </tr>
                <tr>
                  <td colSpan="3">
                    <strong>Precio Servicio</strong>
                  </td>
                  <td>${servicio.servicio.getPrecio().toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardServicioEnCurso;
