import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import '../../styles/AdminLayout.css';
import '../../styles/Orders.css';


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get('http://localhost:5000/api/order/admin/all')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to fetch orders:', err));
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`http://localhost:5000/api/order/${orderId}/status`, { status: newStatus })
      .then(() => fetchOrders())
      .catch((err) => console.error('Failed to update status:', err));
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="admin-page">
        <h1>Customer Orders</h1>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="order-card"
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <h3>Order #{order.id}</h3>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Total:</strong> Rs. {order.total}</p>
              <p><strong>Paid:</strong> Rs. {order.paid_amount}</p>
              <p>
                <strong>Status:</strong>{' '}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </p>
              <p><strong>Ordered on:</strong> {new Date(order.created_at).toLocaleString()}</p>

              {/* Delivery Info Section */}
              <div style={{ marginTop: '10px' }}>
                <h4>Delivery Info:</h4>
                {order.delivery ? (
                  <ul>
                    <li><strong>Name:</strong> {order.delivery.name}</li>
                    <li><strong>Phone:</strong> {order.delivery.phone}</li>
                    <li><strong>Address:</strong> {order.delivery.address}</li>
                    <li><strong>City:</strong> {order.delivery.city}</li>
                    <li><strong>ZIP:</strong> {order.delivery.zip}</li>
                  </ul>
                ) : (
                  <p style={{ color: 'red' }}>No delivery info available.</p>
                )}
              </div>

              {/* Ordered Items */}
              <div style={{ marginTop: '10px' }}>
                <h4>Ordered Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} - {item.quantity} x Rs. {item.price} = Rs. {item.total}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
