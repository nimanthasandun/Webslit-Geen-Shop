import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import '../../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { cartItems, addToCart } = useContext(CartContext);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/product/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setError('Please log in to add items to your cart.');
      return;
    }

    try {
      // Get latest product data to check stock
      const res = await axios.get(`http://localhost:5000/api/product/${id}`);
      const latestProduct = res.data;
      const latestQuantity = latestProduct.quantity;

      // Check if quantity selected is valid
      if (quantity < 1) {
        setError('Quantity must be at least 1.');
        return;
      }

      // Check quantity already in cart
      const existingItem = cartItems.find(item => item.id === latestProduct.id);
      const existingQty = existingItem ? existingItem.quantity : 0;

      const totalDesired = existingQty + quantity;

      if (totalDesired > latestQuantity) {
        const remaining = latestQuantity - existingQty;
        setError(`Only ${remaining} more item(s) in stock.`);
        return;
      }

      // All good: add to cart and redirect
      setError('');
      addToCart({ ...latestProduct, quantity });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      setError('Failed to add to cart. Try again later.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.name}
        className="details-image"
      />
      <div className="details-info">
        <h2>{product.name}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price:</strong> Rs. {product.price}</p>
        <p><strong>Available Stock:</strong> {product.quantity}</p>
        <label>
          <strong>Quantity:</strong>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
