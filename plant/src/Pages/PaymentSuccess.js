import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  if (!orderId || !total) {
    navigate('/');
    return null;
  }

  const handleGoToCart = () => {
    localStorage.setItem('paymentSuccess', 'true');
    localStorage.setItem('paidAmount', total);
    navigate('/cart');
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <h2 className="success-title">Payment Successful</h2>
        <p className="order-detail"><strong>Order ID:</strong> {orderId}</p>
        <p className="order-detail"><strong>Total Paid:</strong> Rs. {total}</p>
        <p className="thank-you-text">Thank you for your order! We’ll begin processing it shortly.</p>
        <button className="go-cart-btn" onClick={handleGoToCart}>
          View My Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
