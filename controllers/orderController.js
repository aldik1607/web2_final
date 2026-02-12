const Order = require('../models/Order');
const Product = require('../models/Product');

const PREMIUM_DISCOUNT_PERCENT = 10;

// Create a new order (single or multiple items)
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const normalizedItems = [];
    let subtotal = 0;

    for (const rawItem of items) {
      const quantity = Number(rawItem.quantity || 1);
      if (!rawItem.productId || quantity <= 0) {
        return res.status(400).json({ message: 'Each item needs productId and valid quantity' });
      }

      const product = await Product.findById(rawItem.productId);
      if (!product || !product.isAvailable) {
        return res.status(404).json({ message: `Product not available: ${rawItem.productId}` });
      }

      const lineTotal = Number(product.price) * quantity;
      subtotal += lineTotal;

      normalizedItems.push({
        product: product._id,
        name: product.name,
        unitPrice: Number(product.price),
        quantity,
        lineTotal
      });
    }

    const discountPercent = req.user.role === 'premium' ? PREMIUM_DISCOUNT_PERCENT : 0;
    const discountAmount = Number((subtotal * (discountPercent / 100)).toFixed(2));
    const total = Number((subtotal - discountAmount).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      subtotal,
      discountPercent,
      discountAmount,
      total
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for current user (admin/moderator can see all)
exports.getOrders = async (req, res) => {
  try {
    const query = ['admin', 'moderator'].includes(req.user.role)
      ? {}
      : { user: req.user._id };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const canAccess = ['admin', 'moderator'].includes(req.user.role) ||
      String(order.user) === String(req.user._id);

    if (!canAccess) {
      return res.status(403).json({ message: 'Not allowed to view this order' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin/moderator only)
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
