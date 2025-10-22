import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        items: cartItems,
        totalAmount: getCartTotal()
      };

      await orderAPI.createOrder(orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Thank you for your purchase, {user.name}!</p>
          <p>Your order has been confirmed and will be processed soon.</p>
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="checkout-item">
              <img 
                src={item.image_url || '/placeholder-image.jpg'} 
                alt={item.name}
              />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          
          <div className="checkout-total">
            <h3>Total: ${getCartTotal().toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={user.name} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} readOnly />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Enter your address" />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" placeholder="Enter your city" />
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
