const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly, adminOrModerator } = require('../middleware/auth');

// Private routes
router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrderById);

// Admin/Moderator can update order status
router.put('/:id', protect, adminOrModerator, orderController.updateOrder);

// Admin only can delete orders
router.delete('/:id', protect, adminOnly, orderController.deleteOrder);

module.exports = router;
