import AceiteMotul from "../RepuestosImg/AceiteMotul.png"
import LlantaMichelin from "../RepuestosImg/LlantaMichelin.webp"
import PastillaFrenoBrembo from "../RepuestosImg/PastillasFrenoBrembo.png"


const repuestos = [
  {
    imagen: AceiteMotul,
    nombre: "Aceite Motul 7100 10W40",
    tipo: "Aceite",
    marca: "Motul",
    modelo: "Universal",
    precio: 50000,
    disponible: true,
    descripcion: "MOTUL 7100 es el mejor lubricante de motor de su clase para una máxima protección, especialmente concebido para proporcionar el mejor rendimiento tanto en conducción por carretera como fuera de ella"
    + " Apto para cualquier tipo de motocicleta de alto rendimiento con motor de 4 tiempos, con o sin caja de cambios integrada, embrague húmedo o seco. Perfecto para motocicletas con sistemas de tratamiento de gases de escape como catalizadores o inyección de aire en el colector de escape"
    +"Diseñado para hacer frente a condiciones severas en conducción deportiva y de aventura."
  },
  {
    imagen: LlantaMichelin,
    nombre: "Llanta Michelin Pilot Street 90/90-17",
    tipo: "Llanta",
    marca: "Michelin",
    modelo: "Yamaha FZ, Pulsar NS",
    precio: 220000,
    disponible: false,
    descripcion: "Encuentra la seguridad y estabilidad que necesitas para recorrer aquellos caminos que tanto anhelas. Siéntete confiado al conducir, garantizando la firmeza precisa en tu andar. Las llantas Michelin te garantizan la seguridad y eficiencia que necesitas, cuidando de una manera destacada el medio ambiente. Su calidad se ve reflejada en cada frenada, ya que son resistentes al desgaste"
        + "La seguridad que buscas con excelente capacidad para evacuar el agua con el fin de evitar el aquaplaning."
  },
  {
    imagen: PastillaFrenoBrembo,
    nombre: "Pastillas de Freno Delanteras",
    tipo: "Frenos",
    marca: "Brembo",
    modelo: "AKT 150, Honda CB",
    precio: 38000,
    disponible: true,
    descripcion: "Las pastillas BREMBO son sinónimo de fiabilidad. Compuesto sinterizado, específico para aplicación en freno delantero, caracterizado por una óptima eficiencia en cualquier condición de uso. Este compuesto está caracterizado por el desgaste limitado que asegura una duración y un kilometraje adecuados"
  },
];

export default repuestos;