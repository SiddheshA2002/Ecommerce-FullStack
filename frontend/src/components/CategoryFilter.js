import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import '../styles/CategoryFilter.css';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // In a real app, you'd have a categories API endpoint
      // For now, we'll simulate with product data
      const response = await productAPI.getProducts();
      const uniqueCategories = [...new Set(response.data.map(p => p.category_id))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="category-filter">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        <option value="">All Categories</option>
        <option value="1">Electronics</option>
        <option value="2">Clothing</option>
        <option value="3">Books</option>
        <option value="4">Home & Garden</option>
      </select>
    </div>
  );
};

export default CategoryFilter;
