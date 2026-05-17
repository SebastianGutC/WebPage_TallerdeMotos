import cron from "node-cron";
import Cita from "../models/citaModel.js";

cron.schedule("*/10 * * * * *", async () => {
  try {

    const ahora = new Date();

    const citasDisponibles = await Cita.find({
      estado: "disponible"
    });

    for (const cita of citasDisponibles) {

      const fecha = new Date(cita.fecha);

      const [horas, minutos] = cita.hora
        .split(":")
        .map(Number);

      fecha.setHours(horas);
      fecha.setMinutes(minutos);
      fecha.setSeconds(0);

      if (fecha < ahora) {

        await Cita.findByIdAndUpdate(
          cita._id,
          {
            estado: "expirada"
          }
        );

        console.log(
          `Cita ${cita._id} marcada como expirada`
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