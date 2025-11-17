const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, default: 'user', enum: ['user', 'admin'] }, // ⬅️ added role field
  verified: { type: Boolean, default: false }, // ⬅️ added verified field
});




module.exports = mongoose.model('User', userSchema);
