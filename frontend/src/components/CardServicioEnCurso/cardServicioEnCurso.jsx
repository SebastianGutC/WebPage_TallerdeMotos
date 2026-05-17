import React, { useEffect, useState } from "react";
import "./CardServicioEnCurso.css";
import { generarFacturaDesdeCita } from "../../services/FacturasService";

function CardServicioEnCurso({ servicio }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [factura, setFactura] = useState(null);
  const [total, setTotal] = useState(0);

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  const mensajesEstado = {
    pendiente: "Tu moto está pendiente de ser recibida en el taller.",
    en_proceso: "Tu servicio está siendo realizado por el técnico.",
    lista: "Tu moto ya está lista para ser recogida.",
    entregada: "El servicio fue entregado exitosamente.",
    cancelada: "La cita fue cancelada.",
    no_asistio: "No asististe a la cita programada.",
  };

  const estadosFrontend = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    lista: "Lista",
    entregada: "Entregada",
    cancelada: "Cancelada",
    no_asistio: "No asistió",
  };

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const res = await generarFacturaDesdeCita(servicio._id);

        setFactura(res.data);
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error("Error fetching total factura:", error);
      }
    };

    if (servicio?._id) {
      fetchFactura();
    }
  }, [servicio]);

  return (
    <>
      <article
        className={`estado ${servicio.estado
          .replace(/\s+/g, "-")
          .toLowerCase()} card-servicio-curso`}
        aria-labelledby={`svc-${servicio._id}-title`}
      >
        <header className="card-header-curso">
          <h4 id={`svc-${servicio._id}-title`} className="cliente-nombre">
            {servicio.motocicletaId
              ? `${servicio.motocicletaId.marca} ${servicio.motocicletaId.nombre}`
              : servicio.placaMoto}
          </h4>

          <span>{estadosFrontend[servicio.estado] || servicio.estado}</span>
        </header>

        <div className="card-body-curso">
          <div className="descripcion">
            <p>{mensajesEstado[servicio.estado]}</p>
          </div>

          <p>
            <strong>Encargado:</strong>{" "}
            <span className="detalle">
              {factura?.tecnico
                ? `${factura.tecnico.nombre} ${factura.tecnico.apellido}`
                : "Sin técnico"}
            </span>
          </p>

          <p>
            <strong>Fecha ingreso:</strong>{" "}
            <span className="detalle">
              {servicio.fechaIngreso
                ? new Date(servicio.fechaIngreso).toLocaleDateString()
                : "No registrada"}
            </span>
          </p>

          <p>
            <strong>Fecha entrega:</strong>{" "}
            <span className="detalle">
              {servicio.fechaEntrega
                ? new Date(servicio.fechaEntrega).toLocaleDateString()
                : "Pendiente"}
            </span>
          </p>

          <p className="valor-pagar">
            Valor a pagar:{" "}
            <strong className="valor-total">${total.toLocaleString()}</strong>
          </p>

          <div className="acciones-card">
            {servicio.estado !== "cancelada" &&
              servicio.estado !== "no_asistio" && (
                <button className="btn-ver" onClick={abrirModal}>
                  Ver más detalles
                </button>
              )}

            {servicio.estado == "lista" && (
              <button className="btn-pagar">Pagar</button>
            )}
          </div>
        </div>
      </article>

      {modalAbierto && factura && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-${servicio._id}-title`}
          onClick={cerrarModal}
        >
          <div className="modal-detalles" onClick={(e) => e.stopPropagation()}>
            <button
              className="cerrar-modal"
              aria-label="Cerrar detalles"
              onClick={cerrarModal}
            >
              ✕
            </button>

            <h3 id={`modal-${servicio._id}-title`} className="modal-titulo">
              Detalles del servicio
            </h3>

            {/* Tabla productos */}
            <section className="modal-seccion">
              <h5 className="subtitulo">Productos usados</h5>

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
                    {factura.productos?.length > 0 ? (
                      factura.productos.map((producto, i) => (
                        <tr key={i}>
                          <td className="text-center">{producto.nombre}</td>

                          <td className="text-center">{producto.cantidad}</td>

                          <td className="text-center">
                            ${producto.costo.toLocaleString()}
                          </td>

                          <td className="text-center">
                            $
                            {(
                              producto.costo * producto.cantidad
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No se usaron productos
                        </td>
                      </tr>
                    )}

                    <tr className="fila-total">
                      <td colSpan="3" className="text-right">
                        <strong>Total Productos</strong>
                      </td>

                      <td className="text-center">
                        <strong>
                          ${factura.totalProductos.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tabla servicios */}
            <section className="modal-seccion">
              <h5 className="subtitulo">Resumen del servicio</h5>

              <div className="tabla-wrap">
                <table className="tabla-servicio">
                  <tbody>
                    <tr>
                      <td className="label">Servicios</td>

                      <td className="valor">
                        {factura.servicios?.length > 0
                          ? factura.servicios.map((s) => s.nombre).join(", ")
                          : "Sin servicios"}
                      </td>
                    </tr>

                    <tr>
                      <td className="label">Precio servicios</td>

                      <td className="valor">
                        ${factura.totalServicios.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="label">Total (servicio + productos)</td>

                      <td className="valor total-final">
                        ${factura.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="modal-acciones">
              {servicio.estado == "lista" && (
                <button className="btn-pagar">Pagar</button>
              )}

              <button className="btn-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardServicioEnCurso;
