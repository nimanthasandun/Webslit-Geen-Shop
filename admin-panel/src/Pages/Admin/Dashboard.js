import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import '../../styles/AdminLayout.css';

const Dashboard = () => {
  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="admin-page">
        <h1>Welcome to Admin Dashboard</h1>
        {/* other content here */}
      </div>
    </>
  );
};

export default Dashboard;
