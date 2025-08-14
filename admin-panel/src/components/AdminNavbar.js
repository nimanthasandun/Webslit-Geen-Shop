// AdminNavbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <nav className="admin-navbar">
      <h2>The Green Shop Welcome Admin</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default AdminNavbar;
