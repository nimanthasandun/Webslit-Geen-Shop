import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { FaShippingFast, FaEnvelope, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './DeliveryForm.css';
import { useNavigate } from 'react-router-dom';

const DeliveryForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: user?.email || '',
    city: '',
    zip: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch delivery info if it exists
  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/delivery/${user.email}`);
        if (res.data) {
          setFormData(res.data);
          setIsSubmitted(true);
          setIsEditing(false);
        }
      } catch (err) {
        console.log('No previous delivery info found.');
      }
    };

    if (user?.email) fetchDelivery();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/delivery', formData);
      setSuccessMessage('✅ Delivery information saved successfully!');
      setIsSubmitted(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving delivery info:', err);
      setSuccessMessage('❌ Failed to save delivery info. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <FaShippingFast className="delivery-icon" />
        <h2>Place Your Order</h2>
        {user && (
          <p className="logged-email">
            <FaEnvelope /> Logged in as: <strong>{user.email}</strong>
          </p>
        )}
        <button className="go-cart-button" onClick={goToCart}>
          <FaTimes /> Go to Cart
        </button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Show saved info */}
      {isSubmitted && !isEditing ? (
        <div className="saved-info">
          <h3>Saved Delivery Info</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>City:</strong> {formData.city}</p>
          <p><strong>Zip:</strong> {formData.zip}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      ) : (
        // Show editable form
        <form className="delivery-form" onSubmit={handleSubmit}>
          <label>Contact Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Telephone No</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Street Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} readOnly />


          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />

          <label>Zip Code</label>
          <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />

          <button type="submit">Save Delivery Info</button>
        </form>
      )}
    </div>
  );
};

export default DeliveryForm;
