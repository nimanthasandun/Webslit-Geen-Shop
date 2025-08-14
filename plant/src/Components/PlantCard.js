import React from 'react';
import '../styles/PlantCard.css';

function PlantCard({ name, image, price, category }) {
  return (
    <div className="plant-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Rs. {price}</p>
      <small>{category}</small>
    </div>
  );
}


export default PlantCard;
