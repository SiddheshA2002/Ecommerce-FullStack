import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <h3>🛒 Easy Shopping</h3>
            <p>Browse through our wide selection of products</p>
          </div>
          <div className="feature-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payment</h3>
            <p>Safe and secure payment options</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
