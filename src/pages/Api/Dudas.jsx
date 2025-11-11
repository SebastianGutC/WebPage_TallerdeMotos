import DialogflowWidget from "../../components/Api/DialogFlow.jsx";
import "../../pages/Api/Dudas.css";

export default function Dudas() {
  return (
    <>
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-center">
          <div className="cell small-12 medium-10 large-8">
            <h2>¿Tienes dudas? 👇</h2>
            <p>
              Chatea con nuestro asistente sobre servicios, precios, horarios, repuestos y más.
            </p>
            <div className="callout">
              <p>Haz tus preguntas y recibe respuesta al instante.</p>
            </div>
          </div>
        </div>
      </div>

      {/* El widget flotante */}
      <DialogflowWidget />
    </>
  );
}
