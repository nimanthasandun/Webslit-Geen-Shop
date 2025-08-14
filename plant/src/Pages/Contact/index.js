import React from 'react';
import '../../styles/AboutUs.css';
import locationImage from '../../images/place1.jpg';



const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-left">
        <h1>About Us</h1>
        <h2>Our Story</h2>
        <p>
          Welcome to The Green Shop! Our passion for plants and nature inspired us to create a space
          where everyone can find beautiful greenery for their home or garden. We believe plants bring joy and peace.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to make plant care simple, fun, and accessible for everyone. Whether you're a beginner or an expert,
          we're here to help you grow your own green paradise.
        </p>

        <h2>Contact Us</h2>
        <p><strong>Phone:</strong> +94 740689655</p>
        <p><strong>Email:</strong>Greenshop@gmail.com</p>
        <p><strong>Address:</strong> 123,Nelegama,Hettipola</p>
      </div>

      <div className="aboutus-right">
        <img 
          src={locationImage} 
          alt="The Green Shop Location" 
        />
      </div>

    </div>
  );
};

export default AboutUs;
