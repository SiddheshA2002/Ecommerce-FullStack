// Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount, cartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  // Sample notifications data
  const sampleNotifications = [
    { id: 1, message: "Your order #12345 has been shipped", type: "success", read: false, timestamp: new Date(Date.now() - 3600000) },
    { id: 2, message: "Flash sale: 50% off on electronics", type: "promo", read: false, timestamp: new Date(Date.now() - 7200000) },
    { id: 3, message: "Welcome bonus! Get $10 off your first order", type: "info", read: true, timestamp: new Date(Date.now() - 86400000) }
  ];

  // Online status detection
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load notifications
  useEffect(() => {
    // In a real app, this would come from an API
    setNotifications(sampleNotifications);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // Get unread notifications count
  const getUnreadNotificationsCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'promo': return '🎉';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛍️</span>
          Shopsy
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              <span className="nav-icon">⚙️</span>
              Admin
            </Link>
          )}
          
          <Link to="/products" className="nav-link">
            <span className="nav-icon">📦</span>
            Products
          </Link>

          {/* Search Bar */}
          <div className="search-container" ref={searchRef}>
            <button 
              className="search-toggle"
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍
            </button>
            {showSearch && (
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="search-submit">
                  Search
                </button>
              </form>
            )}
          </div>

         
         

          {/* Notifications */}
          {user && (
            <div className="notifications-container" ref={notificationsRef}>
              <button 
                className="notifications-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {getUnreadNotificationsCount() > 0 && (
                  <span className="notification-badge">
                    {getUnreadNotificationsCount()}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        className="clear-all-btn"
                        onClick={clearAllNotifications}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <span className="notification-icon">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="notification-content">
                            <p className="notification-message">
                              {notification.message}
                            </p>
                            <span className="notification-time">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart with real-time updates */}
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            Cart 
            <span className="cart-count">{getCartItemsCount()}</span>
            {cartItems.length > 0 && (
              <span className="cart-total">
                ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            )}
          </Link>
          
          {/* User Section */}
          {user ? (
            <div className="user-section" ref={userMenuRef}>
              <button 
                className="user-menu-toggle"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-greeting">
                  Hi, {user.name}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <span className="user-email">{user.email}</span>
                    {user.role === 'admin' && (
                      <span className="user-role">Administrator</span>
                    )}
                  </div>
                  
                  <div className="user-menu-links">
                    <Link 
                      to="/profile" 
                      className="user-menu-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="user-menu-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      📋 My Orders
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="user-menu-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      ❤️ Wishlist
                    </Link>
                    <Link 
                      to="/settings" 
                      className="user-menu-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      ⚙️ Settings
                    </Link>
                  </div>
                  
                  <div className="user-menu-footer">
                    <button 
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : ( 
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                🔑 Login
              </Link>
              <Link to="/register" className="auth-link register">
                📝 Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;