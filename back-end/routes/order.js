const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ─── Routes ───────────────────────────────────────────────────────────────────
// Place a new order
router.post('/', orderController.placeOrder);

// Get orders for a specific user by email
router.get('/user/:email', orderController.getUserOrders);

// Get all orders (for admin)
router.get('/admin/all', orderController.getAllOrders);

// Update order status by order ID (admin)
router.put('/:id/status', orderController.updateOrderStatus);

// Get all ordered items (admin)
router.get('/all-ordered-items', orderController.getAllOrderedItems);

// ✅ NEW: Mark item as sent and reduce stock
router.post('/send-item', orderController.sendOrderedItem);

module.exports = router;
