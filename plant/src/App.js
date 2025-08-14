// src/App.js
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from "./Pages/Home";
import Header from "./Components/Header";
import Deals from './Pages/Deals';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Cart from "./Pages/cart";
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import DeliveryForm from './Pages/DeliveryForm';
import Payment from "./Pages/Payment";
import PaymentSuccess from './Pages/PaymentSuccess';
import MyOrders from './Pages/MyOrders';

// Product category pages
import Plants from './Pages/Products/Plants';
import Pots from './Pages/Products/Pots';
import Seeds from './Pages/Products/Seeds';

// New Product Details Page
import ProductDetails from './Pages/Products/ProductDetails';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Navigate to="/products/plants" />} />
        <Route path="/products/plants" element={<Plants />} />
        <Route path="/products/pots" element={<Pots />} />
        <Route path="/products/seeds" element={<Seeds />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery" element={<DeliveryForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />

      </Routes>
    </>
  );
}

export default App;
