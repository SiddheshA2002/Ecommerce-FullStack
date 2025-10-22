import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      await productAPI.createProduct(productData);
      alert('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        stock_quantity: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Sample categories - in real app, fetch from API
  const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home & Garden' },
    { id: 5, name: 'Sports' },
    { id: 6, name: 'Beauty' }
  ];

  if (!user) {
    return (
      <div className="admin-page">
        <div className="not-authorized">
          <h2>Access Denied</h2>
          <p>Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your products and inventory</p>
      </div>

      <div className="admin-actions">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-product-form">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div className="quick-add-section">
        <h3>Quick Add Sample Products</h3>
        <div className="sample-products">
          {sampleProducts.map((product, index) => (
            <div key={index} className="sample-product-card">
              <h4>{product.name}</h4>
              <p>${product.price} • {product.category}</p>
              <button 
                onClick={() => setFormData(product)}
                className="btn-secondary"
              >
                Use This Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sample products for quick adding
const sampleProducts = [
  {
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation",
    price: "79.99",
    category_id: "1",
    stock_quantity: "100",
    category: "Electronics"
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for all terrains",
    price: "89.99",
    category_id: "5",
    stock_quantity: "75",
    category: "Sports"
  },
  {
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with timer",
    price: "49.99",
    category_id: "4",
    stock_quantity: "30",
    category: "Home & Garden"
  },
  {
    name: "Novel - Mystery Thriller",
    description: "Bestselling mystery thriller novel",
    price: "14.99",
    category_id: "3",
    stock_quantity: "200",
    category: "Books"
  }
];

export default Admin;