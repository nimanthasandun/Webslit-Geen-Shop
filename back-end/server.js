const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve uploaded images

// Routes
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const deliveryRoutes = require('./routes/delivery');
const orderRoutes = require('./routes/order');
const settingsRoutes = require('./routes/settings');
const userOrdersRoutes = require('./routes/userOrders');


app.use('/api/product', require('./routes/product'));
app.use('/api/custom-orders', require('./routes/customOrder'));



app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/custom-orders', userOrdersRoutes);



// Root route
app.get('/', (req, res) => res.send('The Green Shop backend is running'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
