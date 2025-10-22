const db = require('../config/database');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.promise().query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const [categories] = await db.promise().query(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(categories[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCategories, getCategoryById };
