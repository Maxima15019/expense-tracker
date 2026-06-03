const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDbStatus } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection check middleware
app.use((req, res, next) => {
  if (!getDbStatus() && req.path.startsWith('/api')) {
    return res.status(503).json({
      message: 'Database connection is not established. Please verify your database connection in server/.env and check backend console logs for details.',
      dbStatus: 'DISCONNECTED'
    });
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ExpenseFlow API Service' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Route not found: ${req.originalUrl}` });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
