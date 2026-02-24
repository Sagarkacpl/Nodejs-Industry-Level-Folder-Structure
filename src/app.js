// app.js
const express = require('express');
const cors = require('cors');
const app = express();
var cookieParser = require('cookie-parser')
const authRoutes = require('./modules/auth/routes/auth.routes');


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running!' });
});
// Use auth routes
app.use('/api/auth', authRoutes);
module.exports = app;