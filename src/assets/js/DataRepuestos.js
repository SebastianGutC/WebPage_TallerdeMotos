import AceiteMotul from "../RepuestosImg/AceiteMotul.png"
import LlantaMichelin from "../RepuestosImg/LlantaMichelin.webp"
import PastillaFrenoBrembo from "../RepuestosImg/PastillasFrenoBrembo.png"
import TapasLateralesNKD125 from "../RepuestosImg/TapasLateralesNKD125.png"
import TapasTanqueFz150 from "../RepuestosImg/TapasTanqueFz150.png"
import AceiteMotorMobil from "../RepuestosImg/aceite_motor_mobil.png"


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
    {
    imagen: TapasLateralesNKD125,
    nombre: "Tapas Laterales Negra Flexi Con Calcas AK 125 NKD-NKDR-SLR RKJ Kit",
    tipo: "Tapas",
    marca: "AKT",
    modelo: "NKD 125",
    precio: 38200,
    disponible: true,
    descripcion: "Tapas laterales para AKT NKD 125, diseñadas para ofrecer un ajuste perfecto y mantener la estética original de la motocicleta. Fabricadas con materiales resistentes a impactos y a la exposición solar, garantizan durabilidad y una apariencia impecable. Ideales para reemplazar piezas dañadas o renovar el look de tu moto."
  },
      {
    imagen: TapasTanqueFz150,
    nombre: "Tapas Laterales Tanque Yamaha Fz 2.0 Original",
    tipo: "Tapas",
    marca: "Yamaha",
    modelo: "Fz 150",
    precio: 310000,
    disponible: true,
    descripcion: "Par de tapas tanque Yamaha FZ 2.0 original Viene en pasta negra para pintar Sin garantía"
  },
      {
    imagen: AceiteMotorMobil,
    nombre: "ACEITE DE MOTOR MOBIL SUPER 4T ULTRA 20W-50 LITRO",
    tipo: "Aceite",
    marca: "Mobil Super",
    modelo: "Universal",
    precio: 34400,
    disponible: true,
    descripcion: "Aceite de motor Mobil Super 4T Ultra 20W-50 de 1 litro, diseñado para motores de motocicletas de 4 tiempos. Ofrece excelente protección contra el desgaste, mantiene el motor limpio y garantiza un óptimo rendimiento incluso en condiciones de alta temperatura. Ideal para uso diario y trayectos prolongados."
  },
];

export default repuestos;