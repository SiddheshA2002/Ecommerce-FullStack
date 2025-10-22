import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert('Product added to cart!');
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="product-detail">
        <div className="product-image-large">
          <img 
            src={product.image_url || '/placeholder-image.jpg'} 
            alt={product.name}
          />
        </div>
        
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category_name}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="stock-info">
            {product.stock_quantity > 0 ? (
              <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(product.stock_quantity, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="add-to-cart-large"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
