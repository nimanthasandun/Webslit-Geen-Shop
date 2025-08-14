const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// ─── File upload config ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ─── ADD Product ──────────────────────────────────────────────────────────────
// POST /api/product/
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, category, quantity } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!name || !price || !category || !quantity || !image) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const sql = "INSERT INTO products (name, price, category, quantity, image) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, price, category, quantity, image], (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json({ success: true, message: '✅ Product added successfully' });
  });
});

// ─── GET Product by ID ────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json(results[0]);
  });
});

// ─── GET All Products ─────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json(results);
  });
});

// ─── UPDATE Product by ID ─────────────────────────────────────────────────────
router.put('/:id', upload.single('image'), (req, res) => {
  const { name, price, category, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE products SET name=?, price=?, category=?, quantity=?';
  const params = [name, price, category, quantity];

  if (image) {
    sql += ', image=?';
    params.push(image);
  }

  sql += ' WHERE id=?';
  params.push(req.params.id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json({ success: true, message: '📝 Product updated' });
  });
});

// ─── DELETE Product by ID ─────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json({ success: true, message: '🗑️ Product deleted' });
  });
});

// ─── REDUCE Product Quantity After Order ──────────────────────────────────────
// POST /api/product/reduce-quantity
router.post('/reduce-quantity', (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing name or quantity' });
  }

  const sql = "UPDATE products SET quantity = quantity - ? WHERE name = ? AND quantity >= ?";
  db.query(sql, [quantity, name, quantity], (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Not enough stock or product not found' });
    }

    res.json({ success: true, message: '✅ Quantity reduced' });
  });
});

module.exports = router;
