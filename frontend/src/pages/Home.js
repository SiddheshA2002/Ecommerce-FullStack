// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample featured products data - in a real app, this would come from an API
  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Headphones",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image: "https://via.placeholder.com/300x200/50C878/FFFFFF?text=Smart+Watch",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 79.99,
      image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Running+Shoes",
      category: "Fashion"
    },
    {
      id: 4,
      name: "Coffee Maker",
      price: 49.99,
      image: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Coffee+Maker",
      category: "Home"
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate fetching visitor count from an API
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVisitorCount = () => {
      // Generate a random visitor count between 1000 and 5000
      setVisitorCount(Math.floor(Math.random() * 4000) + 1000);
    };
    
    fetchVisitorCount();
  }, []);

  // Set featured products
  useEffect(() => {
    setFeaturedProducts(sampleProducts);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Handle manual carousel navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="dynamic-info">
            <span className="greeting">{getGreeting()}!</span>
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="visitor-count">{visitorCount.toLocaleString()} visitors today</span>
          </div>
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Check out our most popular items</p>
          </div>
          <div className="carousel-container">
            <div className="carousel">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <div className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">${product.price}</p>
                      <Link to={`/products/${product.id}`} className="view-product-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-indicators">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="features-section">
        <div className="section-header">
          <h2>Why Shop With Us</h2>
          <p>We provide the best shopping experience</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🛒 Easy Shopping</h3>
            <p>Browse through our wide selection of products with intuitive navigation</p>
          </div>
          <div className="feature-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep with real-time tracking</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payment</h3>
            <p>Safe and secure payment options with multiple payment methods</p>
          </div>
          <div className="feature-card">
            <h3>🔄 Easy Returns</h3>
            <p>Hassle-free returns within 30 days if you're not satisfied</p>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="offers-section">
        <div className="section-header">
          <h2>Special Offers</h2>
          <p>Limited time deals you don't want to miss</p>
        </div>
        <div className="offers-grid">
          <div className="offer-card">
            <div className="offer-badge">Sale</div>
            <h3>Summer Collection</h3>
            <p>Up to 50% off on selected items</p>
            <Link to="/products/summer-sale" className="offer-link">
              Shop Now
            </Link>
          </div>
          <div className="offer-card">
            <div className="offer-badge">New</div>
            <h3>New Arrivals</h3>
            <p>Fresh products added daily</p>
            <Link to="/products/new-arrivals" className="offer-link">
              Explore
            </Link>
          </div>
          <div className="offer-card">
            <div className="offer-badge">Free Shipping</div>
            <h3>Orders Over $50</h3>
            <p>Free shipping on all orders above $50</p>
            <Link to="/products" className="offer-link">
              Shop More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;