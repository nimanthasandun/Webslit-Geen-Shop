import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/ProductNavbar.css'; // Optional CSS file

const ProductNavbar = () => {
  return (
    <div className="product-navbar">
      <NavLink to="/products/plants" activeclassname="active-link">Flowering Plants</NavLink>
      <NavLink to="/products/pots" activeclassname="active-link">Indoor & Green Plants</NavLink>
      <NavLink to="/products/seeds" activeclassname="active-link">Veggies & Seeds</NavLink>
    </div>
  );
};

export default ProductNavbar;
