import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';
import heroImage from '../images/06.jpg'; // Replace with your uploaded image name

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <section className="hero-section">
      <div className="hero-left animate-slide-left">
        <h1>
          Delivering <span className="highlight-green">Plants</span>,<br />
          Delivering <span className="highlight-green">Happiness</span>
        </h1>
        <p>
          Shop your favourite plants in your favourable factor.Flowering Plants,Indoor & Green Plants,Veggies & Seeds and more...
        </p>
        <button className="hero-btn" onClick={handleShopNow}>Shop Now</button>
      </div>

      <div className="hero-right animate-slide-right">
        <img src={heroImage} alt="Plant Mist" />
      </div>
    </section>
  );
};

export default Hero;
