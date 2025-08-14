import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductNavbar from './ProductNavbar';
import '../styles/ProductList.css';

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data.filter(p => p.category === category)))
      .catch(err => console.error(err));
  }, [category]);

  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-page">
      <ProductNavbar />
      <h2>{category}</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>Rs. {product.price}</p>
            <button onClick={() => handleBuyNow(product.id)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
