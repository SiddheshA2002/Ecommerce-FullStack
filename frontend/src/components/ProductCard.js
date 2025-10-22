import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.image_url || '/placeholder-image.jpg'} 
            alt={product.name}
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category_name}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-stock">
            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </Link>
      <button 
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0}
        className="add-to-cart-btn"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
