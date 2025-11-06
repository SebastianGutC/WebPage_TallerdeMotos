import React from "react";
import HeroSection from "../../components/Home/HeroSection/HeroSection"
import BrandSection from "../../components/Home/BrandSection/BrandSection";
import AllySection from "../../components/Home/AllySection/AllySection";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <BrandSection />
      <AllySection />
    </div>
  );
};

export default Home;