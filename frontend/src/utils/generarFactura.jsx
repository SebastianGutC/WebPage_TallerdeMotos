import { pdf } from "@react-pdf/renderer";
import { FacturaPDF } from "../components/FacturaPDF/FacturaPDF";
import { FacturaCitaPDF } from "../components/FacturaPDF/FacturaCitaPDF";
const now = new Date();
export const invoiceNum = `MTX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900) + 100}`;

export const generarFacturaPDF = async (carrito, usuario) => {
  const blob = await pdf(
    <FacturaPDF carrito={carrito} usuario={usuario} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const nombre = `factura_${usuario.nombre}_${invoiceNum}.pdf`;

  link.download = nombre;
  link.click();
};

export const generarFacturaCitaPDF = async (factura, usuario, cita) => {
  const blob = await pdf(
    <FacturaCitaPDF factura={factura} usuario={usuario}  cita ={cita}/>
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `factura_servicio_${usuario?.nombre ?? "cliente"}_${invoiceNum}.pdf`;
  link.click();
};

