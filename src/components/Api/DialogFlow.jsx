import { useEffect } from "react";

const SCRIPT_SRC = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";

export default function DialogflowWidget() {
  useEffect(() => {
    // Evita duplicar el script durante HMR en Vite
    const alreadyLoaded = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (!alreadyLoaded) {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    // Reemplaza agent-id con el que te da Dialogflow Messenger
  <df-messenger
    chat-title="MotorFix_Agent"
    agent-id="ae059832-fc03-44c2-af14-c591b123b66f"
    language-code="es"
  ></df-messenger>

  );
}
