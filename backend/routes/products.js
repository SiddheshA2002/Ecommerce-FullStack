const express = require('express');
const { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', auth, upload.single('image'), createProduct);
router.put('/:id', auth, upload.single('image'), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;