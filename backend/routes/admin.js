const express = require('express');
const { createAdmin } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Create admin user (protected route - only existing admins can create new admins)
router.post('/create-admin', adminAuth, createAdmin);

// Admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const db = require('../config/database');
    
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [revenueResult] = await db.query('SELECT SUM(total_amount) as revenue FROM orders WHERE status = "delivered"');
    
    res.json({
      users: userCount[0].count,
      products: productCount[0].count,
      orders: orderCount[0].count,
      revenue: revenueResult[0].revenue || 0
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;