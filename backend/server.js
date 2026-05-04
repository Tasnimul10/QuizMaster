require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const resultRoutes = require('./routes/results');
const paymentRoutes = require('./routes/payments');

const app = express();

// --- MIDDLEWARE SECTION (Must be BEFORE routes) ---
app.use(cors()); // Standard cors() is fine, but it MUST be first
app.use(express.json()); 

// --- ROUTES SECTION ---
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/payments', paymentRoutes);

// --- DATABASE SECTION ---
console.log("Connecting to:", process.env.MONGO_URI); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));