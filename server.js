require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Freddie Coffee Shop API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      users: {
        getProfile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      },
      products: {
        getAll: 'GET /api/products',
        getOne: 'GET /api/products/:id',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)'
      },
      orders: {
        create: 'POST /api/orders (private)',
        getAll: 'GET /api/orders (private)',
        getOne: 'GET /api/orders/:id (private)',
        update: 'PUT /api/orders/:id (admin/moderator)',
        delete: 'DELETE /api/orders/:id (admin)'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
