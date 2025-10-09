// ✅ Importamos los servicios ya creados
import servicios from "./DataServicios";

// ========================
// CLASES BASE
// ========================

class Repuesto {
  static idRepuesto = 0;

  constructor(nombre, precio, stock) {
    this.id = ++Repuesto.idRepuesto;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  getNombre() {
    return this.nombre;
  }

  getPrecio() {
    return this.precio;
  }
}

class RepuestoUsado {
  constructor(repuesto, cantidad) {
    this.repuesto = repuesto; // instancia de Repuesto
    this.cantidad = cantidad;
  }

  getSubtotal() {
    return this.repuesto.getPrecio() * this.cantidad;
  }
}

class ServicioEnCurso {
  constructor(
    id,
    cliente,
    moto,
    servicio, // instancia de un servicio importado desde DataServicios
    estado,
    fechaIngreso,
    fechaEntrega,
    empleado,
    repuestosUsados = []
  ) {
    this.id = id;
    this.cliente = cliente;
    this.moto = moto;
    this.servicio = servicio;
    this.estado = estado;
    this.fechaIngreso = fechaIngreso;
    this.fechaEntrega = fechaEntrega;
    this.empleado = empleado;
    this.repuestosUsados = repuestosUsados;
  }
  calcularTotalRepuestos(){
    const totalRepuestos = this.repuestosUsados.reduce(
      (acc, rep) => acc + rep.getSubtotal(),
      0
    );
    return totalRepuestos;

  }

  calcularTotal() {
    const subtotalRepuestos = this.calcularTotalRepuestos();
    const costoServicio = this.servicio.getPrecio();
    return subtotalRepuestos + costoServicio;
  }

  getTotalRepuestos() {
    return this.calcularTotalRepuestos();
  }

  getTotal() {
    return this.calcularTotal();
  }
}

// ========================
// INSTANCIAS DE REPUESTOS
// ========================

const repuesto1 = new Repuesto("Aceite para motor 4T", 38000, 20);
const repuesto2 = new Repuesto("Filtro de aceite", 25000, 15);
const repuesto3 = new Repuesto("Bujía", 12000, 30);
const repuesto4 = new Repuesto("Kit de arrastre", 160000, 6);
const repuesto5 = new Repuesto("Pastillas de freno delanteras", 45000, 10);
const repuesto6 = new Repuesto("Pastillas de freno traseras", 40000, 12);
const repuesto7 = new Repuesto("Bombillo delantero", 10000, 20);

// ========================
// SERVICIOS EN CURSO
// ========================

const serviciosEnCurso = [
  new ServicioEnCurso(
    1,
    "Carlos Pérez",
    "Yamaha FZ 2.0",
    servicios[0], // Cambio de aceite y revisión general
    "En proceso",
    "2025-10-08",
    "2025-10-10",
    "Andrés Gómez",
    [
      new RepuestoUsado(repuesto1, 1),
      new RepuestoUsado(repuesto2, 1),
      new RepuestoUsado(repuesto3, 1),
    ]
  ),

  new ServicioEnCurso(
    2,
    "Carlos Pérez",
    "Honda CB 125",
    servicios[2], // Cambio de kit de arrastre (por ejemplo)
    "Pendiente de entrega",
    "2025-10-05",
    "2025-10-09",
    "Laura Rodríguez",
    [
      new RepuestoUsado(repuesto4, 1),
      new RepuestoUsado(repuesto1, 1),
    ]
  ),

  new ServicioEnCurso(
    3,
    "Carlos Pérez",
    "Bajaj Pulsar NS 200",
    servicios[4], // Cambio de frenos o revisión eléctrica
    "Finalizado",
    "2025-10-01",
    "2025-10-07",
    "Camilo Torres",
    [
      new RepuestoUsado(repuesto5, 1),
      new RepuestoUsado(repuesto6, 1),
      new RepuestoUsado(repuesto7, 1),
    ]
  ),
];

export default serviciosEnCurso;



