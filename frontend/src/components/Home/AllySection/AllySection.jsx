import "./AllySection.css";
import allyImage from "../../../assets/Homeimg/ally_image.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/UseAuth";

const AllySection = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleIngresar = () => {
    if (isAuthenticated) {
      navigate("/servicios");
    } else {
      openLoginModal();
    }
  };

  const reasons = [
    { icon: "fi-wrench", title: "Mantenimiento", desc: "Servicio técnico profesional y confiable." },
    { icon: "fi-shield", title: "Calidad", desc: "Usamos repuestos originales y de alta durabilidad." },
    { icon: "fi-clock", title: "Eficiencia", desc: "Atención rápida sin sacrificar la calidad." },
    { icon: "fi-torso-business", title: "Especializados", desc: "Contamos con personal altamente capacitado." },
  ];

  return (
    <section className="ally-section grid-container">
      <div className="ally-card">
        <div className="ally-image">
          <div className="ally-image-inner">
            <img src={allyImage} alt="mantenimiento" />
          </div>
        </div>

        <div className="ally-content">
          <h3>
            Somos <span className="light-bg">tú mejor aliado</span> por las siguientes razones:
          </h3>

          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <div className="reason-item" key={index}>
                <div className="icon-rectangle">
                  <div className={`fi ${reason.icon}`}></div>
                </div>
                <div>
                  <h4>{reason.title}</h4>
                  <p>{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-container">
            <p>¿Quiéres conocer el estado de tu reparación?</p>
            <button className="cta-button" onClick={handleIngresar}>
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllySection;