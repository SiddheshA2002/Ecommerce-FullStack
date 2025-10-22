import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          E-Commerce
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart ({getCartItemsCount()})
          </Link>
          
          {user ? (
            <div className="user-section">
              <span>Hello, {user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
