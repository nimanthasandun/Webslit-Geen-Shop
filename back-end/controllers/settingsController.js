const db = require('../db');

exports.getSettings = (req, res) => {
  db.query('SELECT * FROM settings WHERE id = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

exports.updateSettings = (req, res) => {
  const { discount_percentage, delivery_fee } = req.body;

  db.query(
    'UPDATE settings SET discount_percentage = ?, delivery_fee = ? WHERE id = 1',
    [discount_percentage, delivery_fee],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Settings updated successfully' });
    }
  );
};
