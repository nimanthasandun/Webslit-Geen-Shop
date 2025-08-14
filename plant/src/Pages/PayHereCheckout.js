import React, { useEffect } from 'react';
import md5 from 'crypto-js/md5';
import { useNavigate } from 'react-router-dom';

const PayHereCheckout = ({ total, user }) => {
  const navigate = useNavigate();
  const merchantId = '1230622';
  const merchantSecret = 'MjM0Njc1ODI2MzE4NDUyOTU4NzE4NjE5ODQ4NzgxMTYyODg5MzA0';
  const orderId = 'ORDER_' + Date.now();
  const currency = 'LKR';

  const amountFormatted = parseFloat(total)
    .toLocaleString('en-US', { minimumFractionDigits: 2 })
    .replaceAll(',', '');

  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const hash = md5(merchantId + orderId + amountFormatted + currency + hashedSecret)
    .toString()
    .toUpperCase();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayNow = () => {
    window.payhere.onCompleted = function (orderIdReturned) {
      // ✅ Clear cart
      localStorage.removeItem('cartItems');
      localStorage.removeItem('deliveryInfo');

      // ✅ Navigate to success page with data
      navigate('/payment-success', {
        state: {
          orderId: orderIdReturned,
          total: total,
        },
      });
    };

    window.payhere.onDismissed = function () {
      alert("⚠️ Payment dismissed by user.");
    };

    window.payhere.onError = function (error) {
      alert("❌ Error occurred: " + error);
    };

    const payment = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: undefined,
      cancel_url: undefined,
      notify_url: 'http://localhost:5000/payhere-notify',

      order_id: orderId,
      items: 'Green Shop Order',
      amount: amountFormatted,
      currency: currency,
      hash: hash,
      first_name: user.firstName || 'Customer',
      last_name: user.lastName || '',
      email: user.email || 'test@example.com',
      phone: user.phone || '0770000000',
      address: user.address || 'No Address',
      city: user.city || 'Colombo',
      country: 'Sri Lanka',
    };

    window.payhere.startPayment(payment);
  };

  return (
    <div>
      <button onClick={handlePayNow} className="payment-button">
        💳 Pay with Credit Card
      </button>
    </div>
  );
};

export default PayHereCheckout;
