import React from "react";
import HeroSection from "../../components/Home/HeroSection/HeroSection"
import BrandSection from "../../components/Home/BrandSection/BrandSection";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <BrandSection />
    </div>
  );
};

export default Home;