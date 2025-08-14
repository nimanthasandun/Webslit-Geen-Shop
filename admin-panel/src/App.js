import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/Admin/AdminLogin';
import Dashboard from './Pages/Admin/Dashboard';
import Products from './Pages/Admin/Products';
import AddProduct from './Pages/Admin/AddProduct';
import Orders from './Pages/Admin/Orders';
import Users from './Pages/Admin/Users';
import Settings from './Pages/Admin/Settings';
import OrderedItems from './Pages/Admin/OrderedItems';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
       <Route path="/admin-profile" element={<Settings />} />
       <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/admin/ordered-items" element={<OrderedItems />} />

      </Routes>
    </Router>
  );
}

export default App;
