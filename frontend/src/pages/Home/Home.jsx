import React from "react";
import HeroSection from "../../components/Home/HeroSection/HeroSection"
import BrandSection from "../../components/Home/BrandSection/BrandSection";
import AllySection from "../../components/Home/AllySection/AllySection.jsx";
import ProductsCard from "../../components/Home/ProductsCard/Productscard";
import CommentSection from "../../components/Home/CommentSection/CommentSection.jsx";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <BrandSection />
      <AllySection />
      <ProductsCard />
      <CommentSection />
    </div>
  );
};

export default Home;