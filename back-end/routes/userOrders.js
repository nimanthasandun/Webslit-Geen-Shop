const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new order
router.post('/', (req, res) => {
  const {
    email, username, productName, price, quantity, address, phone, zip, message
  } = req.body;

  const sql = `INSERT INTO custom_orders
    (email, username, product_name, price, quantity, address, phone, zip, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [email, username, productName, price, quantity, address, phone, zip, message], (err, result) => {
    if (err) return res.status(500).send({ success: false, message: 'DB error' });
    res.send({ success: true, id: result.insertId });
  });
});

// Get orders for a specific user
router.get('/user/:email', (req, res) => {
  const { email } = req.params;
  db.query(
    'SELECT * FROM custom_orders WHERE email = ? ORDER BY created_at DESC',
    [email],
    (err, rows) => {
      if (err) return res.status(500).send({ success: false });
      res.send(rows);
    }
  );
});

// Admin respond to order
router.put('/respond/:id', (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  db.query('UPDATE custom_orders SET admin_response = ? WHERE id = ?', [response, id], (err) => {
    if (err) return res.status(500).send({ success: false });
    res.send({ success: true });
  });
});

module.exports = router;
