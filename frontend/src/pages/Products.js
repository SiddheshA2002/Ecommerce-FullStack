import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { productAPI } from '../services/api';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProducts();
      
      // Handle both response structures
      let productsData = [];
      if (response.data && response.data.products) {
        // New structure with pagination: { products: [], pagination: {} }
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        // Old structure: direct array
        productsData = response.data;
      } else {
        // Fallback: try to use response.data directly
        productsData = response.data || [];
      }
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category_id === parseInt(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <div className="filters">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <div className="products-info">
        <p className="products-count">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && ` in ${getCategoryName(selectedCategory)}`}
        </p>
      </div>

      <div className="products-grid">
        {Array.isArray(filteredProducts) && filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {Array.isArray(filteredProducts) && filteredProducts.length === 0 && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="clear-filters-button"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const categories = {
    1: 'Electronics',
    2: 'Clothing',
    3: 'Books',
    4: 'Home & Garden',
    5: 'Sports',
    6: 'Beauty'
  };
  return categories[categoryId] || 'Selected Category';
};

export default Products;