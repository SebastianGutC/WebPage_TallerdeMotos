import AceiteMotul from "../RepuestosImg/AceiteMotul.webp"
import LlantaMichelin from "../RepuestosImg/LlantaMichelin.webp"
import PastillaFrenoBrembo from "../RepuestosImg/PastillasFrenoBrembo.jpg"


const repuestos = [
  {
    imagen: AceiteMotul,
    nombre: "Aceite Motul 7100 10W40",
    tipo: "Aceite",
    marca: "Motul",
    modelo: "Universal",
    precio: 50000,
    disponible: true,
  },
  {
    imagen: LlantaMichelin,
    nombre: "Llanta Michelin Pilot Street 90/90-17",
    tipo: "Llanta",
    marca: "Michelin",
    modelo: "Yamaha FZ, Pulsar NS",
    precio: 220000,
    disponible: false,
  },
  {
    imagen: PastillaFrenoBrembo,
    nombre: "Pastillas de Freno Delanteras",
    tipo: "Frenos",
    marca: "Brembo",
    modelo: "AKT 150, Honda CB",
    precio: 38000,
    disponible: true,
  },
];

export default repuestos;