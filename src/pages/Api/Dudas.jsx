import DialogflowWidget from "../../components/ChatBot/ChatBot.jsx";

export default function Dudas() {
  return (
    <div className="grid-container dudas-container">
      <div className="grid-x grid-margin-x grid-padding-y">

        <div className="cell small-12 medium-3">
          <h2>¿Tienes dudas?</h2>
          <p>
            Chatea con nuestro asistente sobre servicios, precios, horarios,
            repuestos y más.
          </p>
          <div className="callout">
            <p>Haz tus preguntas y recibe respuesta al instante.</p>
          </div>
        </div>

        <div className="cell small-12 medium-9 chatbot-right">
          <DialogflowWidget />
        </div>

      </div>
    </div>
  );
}

