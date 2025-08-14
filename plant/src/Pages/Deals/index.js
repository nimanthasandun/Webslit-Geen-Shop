import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CustomOrder.css';

const CustomOrder = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    address: '',
    phone: '',
    zip: '',
    message: ''
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) {
      alert('Please log in to submit your order.');
      navigate('/login');
    } else {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/user-orders/user/${user.email}`);
          setOrders(res.data);
        } catch (err) {
          console.error('Error fetching orders', err);
        }
      };

      fetchOrders();
    }
  }, [user?.email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/custom-orders', {
        ...formData,
        email: user.email,
        username: user.username
      });

      alert('Order submitted successfully!');
      setFormData({
        productName: '',
        price: '',
        quantity: '',
        address: '',
        phone: '',
        zip: '',
        message: ''
      });

      // Refresh order list
      const res = await axios.get(`http://localhost:5000/api/custom-orders/user/${user.email}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Error submitting order.');
    }
  };

  return (
    <div className="custom-order-container">
      {/* Order Submission Form */}
      <div className="custom-order-left">
        <h2>Place a Custom Deals</h2>
        <form onSubmit={handleSubmit} className="custom-order-form">
          <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price (LKR)" value={formData.price} onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Delivery Address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message (optional)" value={formData.message} onChange={handleChange}></textarea>
          <button type="submit">Submit Deals</button>
        </form>
      </div>

      {/* Order History */}
      <div className="custom-order-right">
        <h2>Your Deals</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <h4>{order.product_name}</h4>
                <p><strong>Price:</strong> Rs. {order.price}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Zip Code:</strong> {order.zip}</p>
                <p><strong>Your Message:</strong> {order.message || 'None'}</p>
                <p className={order.admin_response ? 'admin-responded' : 'admin-pending'}>
                  <strong>Admin Response:</strong> {order.admin_response || 'Waiting for response'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;
