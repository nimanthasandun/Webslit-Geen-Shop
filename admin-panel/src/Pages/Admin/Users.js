import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';
import '../../styles/AdminLayout.css';

const AdminCustomOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/custom-orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRespond = async (id) => {
    const response = prompt('Enter your message to the user:');
    if (!response) return;

    try {
      await axios.put(`http://localhost:5000/api/custom-orders/respond/${id}`, { response });
      alert('Response sent successfully!');
      // Refresh data
      const updated = await axios.get('http://localhost:5000/api/custom-orders');
      setOrders(updated.data);
    } catch (err) {
      console.error(err);
      alert('Error sending response.');
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="admin-page">
        <h1>Customer Requests</h1>
        <p>Below is a list of custom order requests or inquiries submitted by users.</p>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Product</th>
                <th>Price (LKR)</th>
                <th>Quantity</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Zip</th>
                <th>Message</th>
                <th>Admin Reply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.email}</td>
                  <td>{order.username}</td>
                  <td>{order.product_name}</td>
                  <td>{order.price}</td>
                  <td>{order.quantity}</td>
                  <td>{order.address}</td>
                  <td>{order.phone}</td>
                  <td>{order.zip}</td>
                  <td>{order.message}</td>
                  <td>{order.admin_response || 'No response yet'}</td>
                  <td>
                    <button onClick={() => handleRespond(order.id)}>Respond</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="11" style={{ textAlign: 'center' }}>No requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminCustomOrders;
