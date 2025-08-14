import React, { useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import { FaTimes } from 'react-icons/fa';
import PayHereCheckout from './PayHereCheckout';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { total } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('creditCard');

  const user = {
    firstName: 'Asanga',
    lastName: 'Perera',
    email: 'asanga@example.com',
    phone: '0771234567',
    address: '123, Galle Road',
    city: 'Colombo',
  };

  if (!total) {
    return (
      <div className="payment-error">
        <h2>⚠️ Payment Error</h2>
        <p>Please go back to your cart and try again.</p>
      </div>
    );
  }

  const formattedTotal = total.toLocaleString("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2
  });

  return (
    <div className="payment-wrapper">
      <div className="close-icon" onClick={() => navigate('/cart')} title="Back to Cart">
        <FaTimes />
      </div>

      <h2 className="payment-title">💳 Make Payment</h2>

      <div className="payment-total">
        <p>Total Amount:</p>
        <strong>{formattedTotal}</strong>
      </div>

      <div className="payment-methods">
        <p className="method-label">Select Payment Method:</p>
        <label>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={selectedMethod === 'cash'}
            onChange={() => setSelectedMethod('cash')}
          />
          Cash on Delivery
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="creditCard"
            checked={selectedMethod === 'creditCard'}
            onChange={() => setSelectedMethod('creditCard')}
          />
          Credit Card
        </label>
      </div>

      {selectedMethod === 'cash' ? (
        <button className="payment-button" onClick={() => {
          alert('✅ Payment will be collected on delivery. Thank you!');
          navigate('/');
        }}>
          🛒 Confirm Order
        </button>
      ) : (
        <PayHereCheckout total={total} user={user} />
      )}
    </div>
  );
};

export default Payment;
