import React, { useState } from "react";
import "./CardServicioEnCurso.css";

function CardServicioEnCurso({ servicio }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  return (
    <>
      <article className="card-servicio-curso" aria-labelledby={`svc-${servicio.id}-title`}>
        <header className="card-header-curso">
          <h4 id={`svc-${servicio.id}-title`} className="cliente-nombre">{servicio.moto}</h4>
          <span className={`estado ${servicio.estado.replace(/\s+/g, "-").toLowerCase()}`}>
            {servicio.estado}
          </span>
        </header>

        <div className="card-body-curso">
          
          <p className="descripcion">{servicio.descripcion}</p>
          <p><strong>Encargado:</strong> <span className="detalle">{servicio.empleado}</span></p>
          <p><strong>Fecha ingreso:</strong> <span className="detalle">{servicio.fechaIngreso}</span></p>
          <p><strong>Fecha entrega:</strong> <span className="detalle">{servicio.fechaEntrega}</span></p>


          <p className="valor-pagar">
            Valor a pagar: <strong className="valor-total">${servicio.getTotal().toLocaleString()}</strong>
          </p>


          <div className="acciones-card">
            <button className="btn-ver" onClick={abrirModal}>Ver más detalles</button>
            {servicio.estado !== "Finalizado" && (<button className="btn-pagar">Pagar</button>)}
          </div>
        </div>
      </article>

      {modalAbierto && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby={`modal-${servicio.id}-title`} onClick={cerrarModal}>
          <div className="modal-detalles" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" aria-label="Cerrar detalles" onClick={cerrarModal}>✕</button>

            <h3 id={`modal-${servicio.id}-title`} className="modal-titulo">Detalles del servicio</h3>

            {/* Tabla 1: Repuestos usados */}
            <section className="modal-seccion">
              <h5 className="subtitulo">Repuestos usados</h5>
              <div className="tabla-wrap">
                <table className="tabla-repuestos">
                  <thead>
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
                        <td className="text-center">{r.repuesto.getNombre()}</td>
                        <td className="text-center">{r.cantidad}</td>
                        <td className="text-center">${r.repuesto.getPrecio().toLocaleString()}</td>
                        <td className="text-center">${r.getSubtotal().toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="fila-total">
                      <td colSpan="3" className="text-right"><strong>Total Repuestos</strong></td>
                      <td className="text-center"><strong>${servicio.getTotalRepuestos().toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tabla 2: Resumen del servicio (titulo + precio) */}
            <section className="modal-seccion">
              <h5 className="subtitulo">Resumen del servicio</h5>
              <div className="tabla-wrap">
                <table className="tabla-servicio">
                  <tbody>
                    <tr>
                      <td className="label">Servicio</td>
                      <td className="valor">{servicio.servicio.getTitulo()}</td>
                    </tr>
                    <tr>
                      <td className="label">Precio servicio</td>
                      <td className="valor">${servicio.servicio.getPrecio().toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="label">Total (servicio + repuestos)</td>
                      <td className="valor total-final">${servicio.getTotal().toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Información extra y acciones */}
            <div className="modal-acciones">
              {servicio.estado !== "Finalizado" && (<button className="btn-pagar">Pagar</button>)}
              <button className="btn-cerrar" onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardServicioEnCurso;



