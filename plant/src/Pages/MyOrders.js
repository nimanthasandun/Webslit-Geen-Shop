import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import './MyOrders.css'; // Add a separate CSS file for styling

const MyOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/api/order/user/${user.email}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error('Failed to fetch orders:', err));
    }
  }, [user]);

  return (
    <div className="orders-container">
      <h2 className="orders-heading">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You haven’t placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>^</h3>
              <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="order-info">
              <p><strong>Total:</strong> Rs. {order.total}</p>
              <p><strong>Paid:</strong> Rs. {order.paid_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            <ul className="order-items">
              {order.items.map(item => (
                <li key={item.id}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-detail">
                    {item.quantity} x Rs. {item.price} = Rs. {item.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
