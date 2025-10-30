import React, { useEffect } from "react";
import "./Footer.css";
import "foundation-sites";
import isotipo from "../../../assets/isotipo_mtfx.png";

const Footer = () => {

  return (
    <footer className="footer">
      <div className="grid-x align-middle align-justify footer-content">

        <div className="cell small-12 medium-4 text-center medium-text-left social-icons">
          <a href="#"><i className="fi-social-facebook"></i></a>
          <a href="#"><i className="fi-social-twitter"></i></a>
          <a href="#"><i className="fi-social-instagram"></i></a>
          <a href="#"><i className="fi-social-youtube"></i></a>
        </div>

        <div className="cell small-12 medium-4 text-center footer-text">
          <p>Cra. 43a #19-06, Villa Rosa. Neiva-Huila</p>
          <p>© 2025 MotorFix. Todos los derechos reservados.</p>
        </div>

        <div className="cell small-12 medium-4 text-center medium-text-right">
          <img src={isotipo} alt="Isologo MotoFix Express" className="footer-logo" />
        </div>

      </div>
    </footer>
  );
};

export default Footer;