import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { useUser } from '../contexts/UserContext';

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      loginUser(res.data.user);
// Store user data in context + localStorage
      alert('Login successful');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Login</div>
        <div className="close-button" onClick={() => navigate('/')}>×</div>

        {error && <p style={{color: 'red'}}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
