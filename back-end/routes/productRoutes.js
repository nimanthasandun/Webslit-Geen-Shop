router.get('/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result[0]);
  });
});
