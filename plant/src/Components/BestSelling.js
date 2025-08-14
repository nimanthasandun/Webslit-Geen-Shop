import React from 'react';
import '../styles/BestSelling.css';

const bestSellingPlants = [
  { id: 1, name: '', price: '$15.00', image: require('../images/16.jpg') },
  { id: 2, name: '', price: '$20.00', image: require('../images/17.jpg') },
  { id: 3, name: '', price: '$12.00', image: require('../images/18.jpg') },
  { id: 4, name: '', price: '$18.00', image: require('../images/19.jpg') },
];

const BestSelling = () => {
  return (
    <section className="best-selling">
      <h2>Best Selling Plants</h2>
      <div className="plant-list">
        {bestSellingPlants.map((plant) => (
          <div key={plant.id} className="plant-card">
            <img src={plant.image} alt={plant.name} className="plant-image" />
            <h3>{plant.name}</h3>
            
        
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
