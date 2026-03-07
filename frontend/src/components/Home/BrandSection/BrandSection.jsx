import React from 'react'
import './BrandSection.css'

import yamahaLogo from '../../../assets/Homeimg/yamaha_logo.png'
import hondaLogo from '../../../assets/Homeimg/honda_logo.png'
import suzukiLogo from '../../../assets/Homeimg/suzuki_logo.png'
import kawasakiLogo from '../../../assets/Homeimg/kawasaki_logo.png'
import bajajLogo from '../../../assets/Homeimg/bajaj_logo.png'

const BrandSection = () => {
    const brands = [
    { name: "Yamaha", logo: yamahaLogo },
    { name: "Honda", logo: hondaLogo },
    { name: "Suzuki", logo: suzukiLogo },
    { name: "Kawasaki", logo: kawasakiLogo },
    { name: "Bajaj", logo: bajajLogo },
  ];

  return (
    <section className="brands-section">
      <h3 className="brands-title">Nuestras marcas más Populares</h3>
      <div className="brands-container">
        {brands.map((brand, index) => (
          <div key={index} className="brand-item">
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandSection