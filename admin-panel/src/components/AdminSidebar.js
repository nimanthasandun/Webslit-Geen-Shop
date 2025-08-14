// AdminSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/add-product">Add Product</Link></li>
        <li><Link to="/products">Manage Products</Link></li>
        
        <li>
       <Link to="/admin/ordered-items">Ordered Products</Link>
      </li>

        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/users">Users Deals</Link></li>
        <li><Link to="/admin-profile">Settings</Link></li>
        
        
      </ul>
    </div>
  );
};

export default AdminSidebar;
