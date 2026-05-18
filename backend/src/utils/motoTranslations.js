export const traducirTipo = (type) => {
  const tipos = {
    "sport": "Deportiva",
    "naked": "Naked",
    "cruiser": "Crucero",
    "touring": "Turismo",
    "enduro": "Enduro",
    "motocross": "Motocross",
    "scooter": "Scooter",
    "trail": "Trail",
    "adventure": "Aventura",
    "supermoto": "Supermoto",
    "classic": "Clásica",
    "chopper": "Chopper",
    "dual sport": "Doble propósito",
    "standard": "Estándar",
    "off-road": "Fuera de carretera",
  };
  return tipos[type?.toLowerCase()] || type || "No especificado";
};

export const traducirMotor = (engine) => {
  if (!engine) return "No especificado";
  return engine
    .replace("In-line two", "Bicilíndrico en línea")
    .replace("In-line four", "Cuatro cilindros en línea")
    .replace("In-line three", "Tricilíndrico en línea")
    .replace("Single cylinder", "Monocilíndrico")
    .replace("V-twin", "V-twin")
    .replace("V-four", "V-cuatro")
    .replace("Boxer twin", "Bóxer bicilíndrico")
    .replace("four-stroke", "cuatro tiempos")
    .replace("two-stroke", "dos tiempos")
    .replace("DOHC", "DOHC")
    .replace("SOHC", "SOHC");
};

export const traducirFrenos = (front, rear) => {
  const t = (val) => {
    if (!val) return "No especificado";
    return val
      .replace("Single disc", "Disco simple")
      .replace("Double disc", "Disco doble")
      .replace("Drum", "Tambor")
      .replace("Single-piston caliper", "Pinza un pistón")
      .replace("Multi-piston caliper", "Pinza múltiple")
      .replace("ABS", "ABS")
      .replace(/hydraulic\.?/gi, "")     
      .replace(/\.\s*\./g, ".")           
      .replace(/\s{2,}/g, " ")            
      .trim()
      .replace(/\.$/, "");                
  };
  return `Delantero: ${t(front)} | Trasero: ${t(rear)}`;
};

export const traducirCombustible = (fuel) => {
  if (!fuel) return "Gasolina";
  const f = fuel.toLowerCase();
  if (f.includes("injection")) return "Inyección";
  if (f.includes("carburetor")) return "Carburador";
  if (f.includes("electric")) return "Eléctrico";
  return fuel;
};

export const traducirTransmision = (trans) => {
  if (!trans) return "No especificado";
  return trans
    .replace(/(\d+)-speed/i, "$1 velocidades")
    .replace(/(\d+)\s+speed/i, "$1 velocidades")
    .replace("Manual", "Manual")
    .replace("Automatic", "Automática")
    .replace("Semi-automatic", "Semiautomática")
    .replace("CVT", "CVT (automática continua)")
    .replace(/chain\s*\(final drive\)/gi, "Cadena")     
    .replace(/shaft\s*\(final drive\)/gi, "Cardan")     
    .replace(/belt\s*\(final drive\)/gi, "Correa")      
    .replace(/\s{2,}/g, " ")
    .trim();
};