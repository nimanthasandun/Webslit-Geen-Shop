const db = require('../db');

// ─────────────────────────────────────────────────────────────
// ✅ Place a new order
exports.placeOrder = async (req, res) => {
  const { email, items, total, paidAmount } = req.body;

  try {
    const [orderResult] = await db.promise().execute(
      'INSERT INTO orders (email, total, paid_amount) VALUES (?, ?, ?)',
      [email, total, paidAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.promise().execute(
        'INSERT INTO order_items (order_id, name, price, quantity, category, total) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.name, item.price, item.quantity, item.category, item.total]
      );
    }

    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
};

// ─────────────────────────────────────────────────────────────
// ✅ Get orders for a specific user
exports.getUserOrders = async (req, res) => {
  const email = req.params.email;

  try {
    const [orders] = await db.promise().execute(
      'SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC',
      [email]
    );

    const fullOrders = [];

    for (const order of orders) {
      const [items] = await db.promise().execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      fullOrders.push({ ...order, items });
    }

    res.status(200).json(fullOrders);
  } catch (err) {
    console.error('Fetching orders error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ─────────────────────────────────────────────────────────────
// ✅ Get all orders (admin panel) with delivery info
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().execute(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    const result = [];

    for (const order of orders) {
      const [items] = await db.promise().execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );

      const [delivery] = await db.promise().execute(
        'SELECT * FROM delivery WHERE email = ? LIMIT 1',
        [order.email]
      );

      result.push({
        ...order,
        items,
        delivery: delivery.length > 0 ? delivery[0] : null,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Fetching all orders error:', err);
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

// ─────────────────────────────────────────────────────────────
// ✅ Update order status (used by admin panel)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.promise().execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    res.status(200).json({ message: 'Order status updated.' });
  } catch (err) {
    console.error('Updating status error:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

// ─────────────────────────────────────────────────────────────
// ✅ Get all ordered items (admin)
exports.getAllOrderedItems = async (req, res) => {
  try {
    const [items] = await db.promise().execute(
      'SELECT * FROM order_items ORDER BY order_id DESC'
    );
    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching ordered items:', err);
    res.status(500).json({ message: 'Failed to fetch ordered items' });
  }
};

// ─────────────────────────────────────────────────────────────
// ✅ Send ordered item (reduce stock + mark as sent)
exports.sendOrderedItem = async (req, res) => {
  const { itemId, productName, quantity } = req.body;

  if (!itemId || !productName || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // Step 1: Reduce stock
    const [stockResult] = await db.promise().execute(
      'UPDATE products SET quantity = quantity - ? WHERE name = ? AND quantity >= ?',
      [quantity, productName, quantity]
    );

    if (stockResult.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Step 2: Mark the item as sent
    const [updateResult] = await db.promise().execute(
      'UPDATE order_items SET sent = 1 WHERE id = ?',
      [itemId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Failed to update item status' });
    }

    res.status(200).json({ success: true, message: 'Item marked as sent and stock updated' });
  } catch (err) {
    console.error('Send item error:', err);
    res.status(500).json({ success: false, message: 'Error while sending item' });
  }
};
