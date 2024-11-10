const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize express
const app = express();

// Log environment
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
})
.catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Debug route registration
console.log('Registering routes...');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/performance', require('./routes/performanceRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/grouped-performances', require('./routes/groupedPerformanceRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root route with API information
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Athledger API',
    status: 'Running',
    endpoints: {
      users: '/api/users',
      performance: '/api/performance',
      transactions: '/api/transactions',
      groupedPerformances: '/api/grouped-performances'
    }
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server ready at http://localhost:${PORT}`);
  
  // Log registered routes for debugging
  console.log('\nRegistered Routes:');
  app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
      Object.keys(r.route.methods).forEach(method => {
        console.log(`${method.toUpperCase()} ${r.route.path}`);
      });
    }
  });
});