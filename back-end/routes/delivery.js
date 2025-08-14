const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/delivery — Insert or Update delivery info
router.post('/', (req, res) => {
  const { name, phone, address, email, city, zip } = req.body;

  if (!name || !phone || !address || !email || !city || !zip) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO delivery (name, phone, address, email, city, zip)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      phone = VALUES(phone),
      address = VALUES(address),
      city = VALUES(city),
      zip = VALUES(zip)
  `;

  db.query(sql, [name, phone, address, email, city, zip], (err, result) => {
    if (err) {
      console.error('MySQL error while inserting/updating delivery info:', err);
      return res.status(500).json({ message: 'Error saving delivery info' });
    }

    res.status(200).json({ message: 'Delivery info saved successfully' });
  });
});

// GET /api/delivery/:email — Fetch delivery info for a user
router.get('/:email', (req, res) => {
  const email = req.params.email;

  const sql = 'SELECT * FROM delivery WHERE email = ? LIMIT 1';

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('MySQL error while fetching delivery info:', err);
      return res.status(500).json({ message: 'Error retrieving delivery info' });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'No delivery info found' });
    }
  });
});

module.exports = router;
