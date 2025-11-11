import React from "react";
import HeroSection from "../../components/Home/HeroSection/HeroSection"
import BrandSection from "../../components/Home/BrandSection/BrandSection";
import AllySection from "../../components/Home/AllySection/AllySection";
import ProductsCard from "../../components/Home/ProductsCard/Productscard";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <BrandSection />
      <AllySection />
      <ProductsCard />
    </div>
  );
};

export default Home;