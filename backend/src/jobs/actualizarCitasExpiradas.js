import cron from "node-cron";
import Cita from "../models/citaModel.js";

cron.schedule("*/10 * * * * *", async () => {
  try {

    const ahora = new Date();

    const citasDisponibles = await Cita.find({
      estado: "disponible"
    });

    for (const cita of citasDisponibles) {

      const fechaStr = cita.fecha.toISOString().split("T")[0];
      const fechaCita = new Date(`${fechaStr}T${cita.hora}:00`);

      if (fechaCita < ahora) {

        await Cita.findByIdAndUpdate(
          cita._id,
          {
            estado: "expirada"
          }
        );

        console.log(
          `Cita ${cita._id} marcada como expirada, hora de la cita: ${cita.hora} ahora: ${ahora}`
        );
      }
    }

  } catch (error) {

    console.error(
      "Error actualizando citas expiradas:",
      error
    );

  }
});