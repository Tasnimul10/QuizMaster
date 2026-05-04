const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  walletBalance: { type: Number, default: 0 }, // For teachers' earnings
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);