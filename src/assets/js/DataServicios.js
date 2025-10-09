// Clase Servicio
class Servicio {
  static idServicio = 0;

  constructor(titulo, descripcion, icono, precio) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.icono = icono; // clase del ícono de Foundation
    this.precio = precio;
    this.id = ++Servicio.idServicio;
  }

  getId() { return this.id; }
  getTitulo() { return this.titulo; }
  getDescripcion() { return this.descripcion; }
  getIcono() { return this.icono; }
  getPrecio() { return this.precio; }

  setTitulo(titulo) { this.titulo = titulo; }
  setDescripcion(descripcion) { this.descripcion = descripcion; }
  setIcono(icono) { this.icono = icono; }
  setPrecio(precio) { this.precio = precio; }
}

const DataServicios = [
  new Servicio(
    "Cambio de aceite",
    "Sustitución del aceite del motor con productos de alta calidad.",
    "fi-shield",
    45000
  ),
  new Servicio(
    "Mantenimiento general",
    "Inspección completa de frenos, luces, niveles, cadena y motor.",
    "fi-wrench",
    80000
  ),
  new Servicio(
    "Alineación y balanceo",
    "Alineación de dirección y balanceo de ruedas para mayor estabilidad.",
    "fi-asterisk",
    60000
  ),
  new Servicio(
    "Cambio de llantas",
    "Montaje y calibración profesional de neumáticos nuevos o usados.",
    "fi-shuffle",
    25000
  ),
  new Servicio(
    "Reparación de frenos",
    "Cambio de pastillas, líquido y ajuste de frenos delantero y trasero.",
    "fi-alert",
    70000
  ),
  new Servicio(
    "Lavado y detallado",
    "Lavado completo, encerado y detallado profesional de tu moto.",
    "fi-star",
    30000
  ),
  new Servicio(
    "Cambio de batería",
    "Sustitución de batería con revisión de carga y sistema eléctrico.",
    "fi-battery-full",
    65000
  ),
  new Servicio(
    "Diagnóstico electrónico",
    "Revisión con escáner de los sistemas electrónicos de la moto.",
    "fi-monitor",
    55000
  ),
  new Servicio(
    "Revisión de suspensión",
    "Chequeo y ajuste de amortiguadores delanteros y traseros.",
    "fi-widget",
    50000
  ),
  new Servicio(
    "Pintura y estética",
    "Retoque de pintura, pulido y personalización estética.",
    "fi-paint-bucket",
    120000
  ),
];

export default DataServicios;