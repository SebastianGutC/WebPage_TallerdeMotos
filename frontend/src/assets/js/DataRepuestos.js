import AceiteMotul from "../RepuestosImg/AceiteMotul.png"
import LlantaMichelin from "../RepuestosImg/LlantaMichelin.webp"
import PastillaFrenoBrembo from "../RepuestosImg/PastillasFrenoBrembo.png"
import TapasLateralesNKD125 from "../RepuestosImg/TapasLateralesNKD125.png"
import TapasTanqueFz150 from "../RepuestosImg/TapasTanqueFz150.png"
import AceiteMotorMobil from "../RepuestosImg/aceite_motor_mobil.png"
import FiltroAireFz150 from "../RepuestosImg/FiltroAireFZ150.png"
import CadenaDID428Reforzada from "../RepuestosImg/CadenaDID428ReforzadaDorada.png"
import KitArrastreGn125 from "../RepuestosImg/KitArrastreGn125.png"
import BateriaYuasa from "../RepuestosImg/BateriaYuasa.png"
import AmortiguadoresTraseros from "../RepuestosImg/AmortiguadoresTraseros.png"
import EspejosNaked from "../RepuestosImg/EspejosNaked.png"
import DireccionalIzquierdaGz from "../RepuestosImg/direccional_trasera_izquierda.png"
import KitLuces6000k from "../RepuestosImg/kit_luces_6000k.png"
import Guardabarro from "../RepuestosImg/guardabarro.png"

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
    disponible: true,
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
    // 🔹 Nuevos productos
  {
    imagen: CadenaDID428Reforzada,
    nombre: "Cadena DID 428HD 130L Refuerzo Dorado",
    tipo: "Transmisión",
    marca: "DID",
    modelo: "AKT 150, Yamaha FZ, Pulsar 180",
    precio: 95000,
    disponible: true,
    descripcion:
      "Cadena reforzada DID 428HD de 130 eslabones, ideal para motos de 125cc a 200cc. Fabricada en acero tratado térmicamente, ofrece excelente resistencia al desgaste y estiramiento.",
  },
  {
    imagen: FiltroAireFz150,
    nombre: "Filtro de Aire Yamaha FZ16 Original",
    tipo: "Filtro",
    marca: "Yamaha",
    modelo: "FZ16, FZ 2.0",
    precio: 48000,
    disponible: true,
    descripcion:
      "Filtro de aire original Yamaha FZ16. Mantiene el flujo de aire limpio al motor, mejorando la eficiencia de combustible y el rendimiento del motor. Producto 100% original.",
  },
  {
    imagen: KitArrastreGn125,
    nombre: "Kit de Arrastre Suzuki GN125 DID",
    tipo: "Transmisión",
    marca: "DID",
    modelo: "Suzuki GN125",
    precio: 210000,
    disponible: true,
    descripcion:
      "Kit completo de arrastre DID para Suzuki GN125, incluye piñón, corona y cadena reforzada. Diseñado para alto rendimiento y durabilidad en condiciones urbanas y de carretera.",
  },
  {
    imagen: BateriaYuasa,
    nombre: "Batería Yuasa YTX7A-BS Libre de Mantenimiento",
    tipo: "Batería",
    marca: "Yuasa",
    modelo: "AKT 125, Honda CB125, Yamaha FZ",
    precio: 165000,
    disponible: true,
    descripcion:
      "Batería sellada Yuasa YTX7A-BS de 12V libre de mantenimiento. Ofrece excelente capacidad de arranque, resistencia a vibraciones y larga vida útil. Ideal para motos de hasta 200cc.",
  },
  {
    imagen: AmortiguadoresTraseros,
    nombre: "Amortiguadores Traseros Cromados Universal 320mm",
    tipo: "Suspensión",
    marca: "RCB",
    modelo: "Universal 150-200cc",
    precio: 195000,
    disponible: false,
    descripcion:
      "Amortiguadores traseros universales de 320mm con resortes cromados. Mejoran la estabilidad y el confort en conducción urbana. Compatibles con varias referencias AKT, Yamaha y Honda.",
  },
  {
    imagen: EspejosNaked,
    nombre: "Espejos Laterales Rizoma Universal Tipo Naked",
    tipo: "Accesorios",
    marca: "Rizoma",
    modelo: "Universal",
    precio: 120000,
    disponible: true,
    descripcion:
      "Par de espejos laterales Rizoma tipo Naked, fabricados en aluminio anodizado de alta calidad. Diseño deportivo y aerodinámico, ajustables y compatibles con la mayoría de manillares estándar.",
  },
    {
    imagen: DireccionalIzquierdaGz,
    nombre: "Direccional Trasera Izquierda Para Suzuki Gz 150",
    tipo: "Accesorios",
    marca: "Suzuki",
    modelo: "Gz 150",
    precio: 71300,
    disponible: true,
    descripcion:
      "Las direccionales de la Suzuki GZ 150 son componentes de seguridad y visibilidad, diseñados para indicar las maniobras de la moto. Son piezas resistentes y duraderas, fáciles de ver tanto de día como de noche, lo que mejora la comunicación con otros conductores y reduce el riesgo de accidentes. ",
  },
{
  imagen: KitLuces6000k,
  nombre: "Kit de Luces LED Alta Intensidad H4 6000K",
  tipo: "Iluminación",
  marca: "TechLight",
  modelo: "Universal H4",
  precio: 68000,
  disponible: false,
  descripcion:
    "Kit de luces LED H4 de alta intensidad con temperatura de color 6000K. Ofrece mayor visibilidad nocturna, bajo consumo energético y una vida útil superior a la de los bombillos halógenos tradicionales. Compatible con la mayoría de motos que usan bombilla H4.",
},
{
  imagen: Guardabarro,
  nombre: "Guardabarro Delantero Universal Para Moto",
  tipo: "Accesorios",
  marca: "StormParts",
  modelo: "Universal 125-200cc",
  precio: 45000,
  disponible: true,
  descripcion:
    "Guardabarro delantero universal fabricado en ABS reforzado. Diseño deportivo y adaptable a la mayoría de motos entre 125cc y 200cc. Ideal para reemplazos o personalización, resistente al agua, barro y vibraciones.",
},

];

export default repuestos;