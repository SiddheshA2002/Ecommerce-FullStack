const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get all products
const getProducts = async (req, res) => {
  try {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];
    
    // Search filter
    if (req.query.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Category filter
    if (req.query.category) {
      query += ' AND p.category_id = ?';
      params.push(req.query.category);
    }
    
    // Price range filter
    if (req.query.minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(req.query.minPrice));
    }
    
    if (req.query.maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(req.query.maxPrice));
    }
    
    // Sorting
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const allowedSortFields = ['name', 'price', 'created_at', 'stock_quantity'];
    
    if (allowedSortFields.includes(sortBy)) {
      query += ` ORDER BY p.${sortBy} ${sortOrder}`;
    } else {
      query += ' ORDER BY p.created_at DESC';
    }
    
    // Check if pagination is requested
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
      const countParams = [];
      
      if (req.query.search) {
        countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        const searchTerm = `%${req.query.search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      
      if (req.query.category) {
        countQuery += ' AND p.category_id = ?';
        countParams.push(req.query.category);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      const total = countResult[0].total;
      
      const [products] = await db.query(query, params);
      
      return res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
    
    // No pagination - return simple array
    const [products] = await db.query(query, params);
    res.json(products);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity } = req.body;
    
    // Validation
    if (!name || !description || !price || !category_id || stock_quantity === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    
    const [result] = await db.query(
      `INSERT INTO products (name, description, price, category_id, stock_quantity, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, parseFloat(price), category_id, parseInt(stock_quantity), image_url]
    );
    
    const [newProduct] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity } = req.body;
    const productId = req.params.id;
    
    // Check if product exists
    const [existingProducts] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let image_url = existingProducts[0].image_url;
    if (req.file) {
      // Delete old image if exists
      if (image_url && image_url.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }
    
    await db.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, stock_quantity = ?
       WHERE id = ?`,
      [name, description, parseFloat(price), category_id, image_url, parseInt(stock_quantity), productId]
    );
    
    const [updatedProduct] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [productId]
    );
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [existingProducts] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated image
    const image_url = existingProducts[0].image_url;
    if (image_url && image_url.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
};