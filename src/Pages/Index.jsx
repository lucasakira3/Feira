import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductSection from '../components/ProductSection';
import AboutUsSection from '../components/AboutUsSection';
import VideoSection from "../components/VideoSection.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
    <Header />
    <main>
    <div className="container-fluid">
      <div className="content-wrapper">
        <HeroSection />
        <ProductSection />
        <AboutUsSection />
        <VideoSection />
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}

export default HomePage;
