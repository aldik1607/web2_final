const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly, adminOrModerator } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Admin/Moderator routes
router.post('/', protect, adminOrModerator, validateProduct, productController.createProduct);
router.put('/:id', protect, adminOrModerator, productController.updateProduct);

// Admin-only route
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;
