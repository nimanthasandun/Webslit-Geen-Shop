import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { useUser } from '../../contexts/UserContext';

const API_URL = 'http://localhost:5000/api/products'; // Adjust if needed

const Header = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const searchRef = useRef(null); // Ref for detecting outside click

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products as user types
  useEffect(() => {
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(searchTerm ? results : []);
  }, [searchTerm, products]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFiltered([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (filtered.length > 0) {
      navigate(`/product/${filtered[0].id}`);
    }
  };

  return (
    <div className="headerWrapper">
      {/* Top welcome strip */}
      <div className="top-strip bg-green">
        <div className="container">
          <p className="mb-0 mt-0 text-center">
            Welcome to <b>The Green Shop</b> — Nature at Your Doorstep
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container headerContainer">
          {/* Logo */}
          <div className="logoWrapper">
            <Link to="/"><img src={Logo} alt="Logo" /></Link>
          </div>

          {/* Search Bar */}
          <div className="headerSearch" ref={searchRef}>
            <input
              type="text"
              placeholder="Search for Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearchClick}><IoSearch /></Button>

            {/* Suggestions */}
            {filtered.length > 0 && (
              <ul className="search-suggestions">
                {filtered.map((p) => (
                  <li key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="navBar">
            <Link to="/" className="navLink">Home</Link>
            <Link to="/products" className="navLink">Products</Link>
            <Link to="/deals" className="navLink">Deals</Link>
            <Link to="/contact" className="navLink">Contact</Link>
          </nav>

          {/* Header Buttons */}
          <div className="headerButtons">
            {user ? (
              <>
                <span style={{ marginRight: '10px' }}> {user.name}</span>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="circle"><FiUser /></Button>
              </Link>
            )}
            <Link to="/cart">
              <Button className="circle cartButton"><FiShoppingCart /></Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
