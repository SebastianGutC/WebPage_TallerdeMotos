import Cita from "../models/citaModel.js";


const calcularTotales = (cita) => {
  const totalServicios = cita.servicios.reduce(
    (acc, s) => acc + (s.costo || 0),
    0
  );

  const totalProductos = cita.productos.reduce(
    (acc, p) => acc + (p.costo * p.cantidad),
    0
  );

  return {
    totalServicios,
    totalProductos,
    total: totalServicios + totalProductos
  };
};


export const generarFacturaDesdeCita = async (req, res) => {
  try {
    const { citaId } = req.params;

    const cita = await Cita.findById(citaId)
      .populate("usuarioId")
      .populate("tecnicoId")
      .populate("motocicletaId");

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const totales = calcularTotales(cita);

    res.json({
      citaId: cita._id,
      cliente: cita.usuarioId,
      tecnico: cita.tecnicoId,
      motocicleta: cita.motocicletaId,
      servicios: cita.servicios,
      productos: cita.productos,
      estado: cita.estado,
      ...totales
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al generar factura",
      error: error.message
    });
  }
};


export const getFacturasByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const citas = await Cita.find({ usuarioId })
      .populate("usuarioId")
      .populate("tecnicoId");

    const facturas = citas.map((cita) => {
      const totales = calcularTotales(cita);

      return {
        citaId: cita._id,
        fecha: cita.fecha,
        estado: cita.estado,
        ...totales
      };
    });

    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener facturas del usuario",
      error: error.message
    });
  }
};


export const getFacturas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate("usuarioId")
      .populate("tecnicoId");

    const facturas = citas.map((cita) => {
      const totales = calcularTotales(cita);

      return {
        citaId: cita._id,
        cliente: cita.usuarioId,
        tecnico: cita.tecnicoId,
        fecha: cita.fecha,
        estado: cita.estado,
        ...totales
      };
    });

    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener facturas",
      error: error.message
    });
  }
};