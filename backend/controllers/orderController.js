const db = require('../config/database');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.userId;
    
    // Start transaction
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [userId, totalAmount]
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.id, item.quantity, item.price]
        );
      }
      
      await connection.commit();
      res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder };
