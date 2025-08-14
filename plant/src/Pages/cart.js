import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCircle, FaCheckCircle, FaExclamationTriangle,
  FaCreditCard, FaClipboardList
} from 'react-icons/fa';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null, name: '', price: '', quantity: '', total: '', stock: 0
  });

  const [deliverySubmitted, setDeliverySubmitted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Delivery & Discount from backend
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const fetchDelivery = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`http://localhost:5000/api/delivery/${user.email}`);
          if (res.data?.name) setDeliverySubmitted(true);
        } catch {
          setDeliverySubmitted(false);
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/settings');
        setDiscountPercentage(res.data.discount_percentage || 0);
        setDeliveryFee(res.data.delivery_fee || 0);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchDelivery();
    fetchSettings();

    const paid = localStorage.getItem('paymentSuccess');
    const amount = localStorage.getItem('paidAmount');
    if (paid === 'true' && amount) {
      setPaymentSuccess(true);
      setPaidAmount(Number(amount));
      localStorage.removeItem('paymentSuccess');
      localStorage.removeItem('paidAmount');
    }
  }, [user]);

  const formatCurrency = value =>
    value.toLocaleString('en-LK', {
      style: 'currency', currency: 'LKR', minimumFractionDigits: 2
    });

  const subTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = (subTotal * discountPercentage) / 100;
  const total = Number(subTotal) - Number(discount) + Number(deliveryFee);


  const handleBuyNow = async () => {
    if (!deliverySubmitted || !paymentSuccess) {
      alert('Please submit delivery info and complete payment first.');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.type || '',
        total: item.price * item.quantity
      }));

      await axios.post('http://localhost:5000/api/order', {
        email: user.email,
        items: orderItems,
        subTotal,
        discountPercentage,
        discount,
        deliveryFee,
        total,
        paidAmount
      });

      clearCart();
      navigate('/my-orders');
    } catch (err) {
      alert('Error placing order. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="cart-wrapper">
      {user ? (
        <>
          <div className="user-info">
            <p><FaUserCircle className="icon" /> Logged in as <strong>{user.email}</strong></p>
            <button className="btn orders-btn" onClick={() => navigate('/my-orders')}>
              <FaClipboardList /> My Orders
            </button>
          </div>

          <div className="cart-content">
            <div className="cart-section">
              <h3>Your Cart</h3>
              {cartItems.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <ol>
                  {cartItems.map(item => (
                    <li key={item.id} onClick={() => setFormData({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      total: item.price * item.quantity,
                      stock: item.stock || 100
                    })}>
                      {item.name} – Quantity: {item.quantity} – {formatCurrency(item.price * item.quantity)}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="form-section">
              {/* Product details section */}
              <div className="form-group"><label>Product Name:</label><input value={formData.name} readOnly /></div>
              <div className="form-group"><label>Price:</label><input value={formatCurrency(Number(formData.price) || 0)} readOnly /></div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={formData.stock}
                  value={formData.quantity || 1}
                  onChange={e => {
                    let q = parseInt(e.target.value) || 1;
                    q = Math.max(1, Math.min(q, formData.stock));
                    setFormData({ ...formData, quantity: q, total: formData.price * q });
                  }}
                />
              </div>
              <div className="form-group"><label>Total:</label><input value={formatCurrency(Number(formData.total) || 0)} readOnly /></div>

              <div className="form-buttons">
                <button
                  className="btn update-btn"
                  onClick={() => {
                    const orig = cartItems.find(i => i.id === formData.id);
                    if (!orig) return;
                    if (formData.quantity < orig.quantity) {
                      updateQuantity(formData.id, formData.quantity);
                      setMessage('Quantity updated successfully.');
                      setMessageType('success');
                    } else if (formData.quantity > orig.quantity) {
                      setMessage('To increase quantity, please go to the product page and add more.');
                      setMessageType('warning');
                    } else {
                      setMessage('Quantity unchanged.');
                      setMessageType('info');
                    }
                  }}
                >Update</button>

                <button
                  className="btn remove-btn"
                  onClick={() => {
                    if (formData.id) {
                      removeFromCart(formData.id);
                      setFormData({ id: null, name: '', price: '', quantity: '', total: '', stock: 0 });
                      setMessage('');
                      setMessageType('');
                    }
                  }}
                >Remove</button>
              </div>

              {message && (
                <div className={`message ${messageType}`}>
                  {messageType === 'warning' ? (
                    <>
                      {message}{' '}
                      <Link to={`/product/${formData.id}`} className="product-link">
                        Go to product page
                      </Link>
                    </>
                  ) : message}
                </div>
              )}
            </div>

            <div className="total-section">
              <h4>Cart Total</h4>
              <p>Sub Total: {formatCurrency(subTotal)}</p>
              <p>Discount ({discountPercentage}%): -{formatCurrency(discount)}</p>
              <p>Delivery Fee (LKR): {formatCurrency(deliveryFee)}</p>
              <hr />
              <p><strong>Total: {formatCurrency(total)}</strong></p>

              {cartItems.length > 0 && (
                <div className="cart-actions">
                  <Link to="/delivery" className="btn primary-btn">Proceed to Delivery Form</Link>
                  {deliverySubmitted ? (
                    <>
                      <p className="success-msg"><FaCheckCircle /> Delivery info submitted</p>
                      <button onClick={() => navigate('/payment', { state: { total } })} className="btn success-btn">Proceed to Payment</button>
                      {!paymentSuccess && (
                        <p className="error-msg"><FaExclamationTriangle /> Please complete payment</p>
                      )}
                    </>
                  ) : (
                    <p className="error-msg"><FaExclamationTriangle /> Please complete delivery info</p>
                  )}
                </div>
              )}

              {paymentSuccess && (
                <div className="payment-success">
                  <FaCreditCard /> Payment of {formatCurrency(paidAmount)} was successful.
                </div>
              )}
            </div>
          </div>

          {cartItems.length > 0 && paymentSuccess && deliverySubmitted && (
            <div className="buy-now-footer">
              <button className="btn info-btn buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>
          )}
        </>
      ) : (
        <div className="login-prompt">
          <h2>Welcome to The Green Shop!</h2>
          <p>Please log in to view your cart and manage your plants.</p>
          <Link to="/login" className="btn login-btn">Log In</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
