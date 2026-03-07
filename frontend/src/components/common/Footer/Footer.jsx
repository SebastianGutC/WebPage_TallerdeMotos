import React, { useEffect } from "react";
import "./Footer.css";
import "foundation-sites";
import isotipo from "../../../assets/isotipo_mtfx.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";


const Footer = () => {

  return (
    <footer className="footer">
      <div className="grid-x align-middle align-justify footer-content">

        <div className="cell small-12 medium-4 text-center medium-text-left social-icons">
          <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
          <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
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