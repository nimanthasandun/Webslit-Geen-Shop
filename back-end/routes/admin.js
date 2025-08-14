const express = require('express');
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Use a strong secret key

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('✅ Received admin login request:', username);

  const sql = 'SELECT * FROM admin WHERE username = ?';
  conn.query(sql, [username], (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = results[0];
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  });
});

module.exports = router;
