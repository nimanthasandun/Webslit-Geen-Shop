import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';
import '../../styles/AdminLayout.css';
import '../../styles/OrderedItems.css';


const OrderedItems = () => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchOrderedItems();
  }, []);

  const fetchOrderedItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/order/all-ordered-items');
      setOrderedItems(res.data);

      const unsentCount = res.data.filter(item => !item.sent).length;
      setNotificationCount(unsentCount);
    } catch (err) {
      console.error('Error fetching ordered items:', err);
    }
  };

  const handleSend = async (item) => {
    try {
      const res = await axios.post('http://localhost:5000/api/order/send-item', {
        itemId: item.id,
        productName: item.name,
        quantity: item.quantity,
      });

      if (res.data.success) {
        fetchOrderedItems(); // Refresh list
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <AdminNavbar notificationCount={notificationCount} />
      <AdminSidebar />
      <div className="admin-page">
        <h1>Ordered Products</h1>
        {orderedItems.length === 0 ? (
          <p>No ordered products found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orderedItems.map(item => (
                <tr key={item.id}>
                  <td>{item.order_id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.price}</td>
                  <td>Rs. {item.total}</td>
                  <td>
                    {item.sent ? (
                      <button disabled style={{ backgroundColor: 'green', color: 'white' }}>Sent ✅</button>
                    ) : (
                      <button onClick={() => handleSend(item)}>Send</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrderedItems;
