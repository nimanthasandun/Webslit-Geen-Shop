import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import '../../styles/Settings.css';


const Settings = () => {
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/settings')
      .then(res => {
        setDiscount(res.data.discount_percentage);
        setDeliveryFee(res.data.delivery_fee);
      })
      .catch(() => setMessage('Error loading settings'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:5000/api/settings', {
      discount_percentage: discount,
      delivery_fee: deliveryFee
    })
    .then(() => setMessage('Settings updated successfully'))
    .catch(() => setMessage('Failed to update settings'));
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="admin-page">
        <h2>Cart Settings</h2>
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Discount Percentage (%)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Delivery Fee (LKR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />
          </div>
          <button type="submit" className="btn update-btn">Update</button>
        </form>
        {message && <p className="settings-message">{message}</p>}
      </div>
    </>
  );
};

export default Settings;
