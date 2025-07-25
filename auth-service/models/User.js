const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, default: 'user', enum: ['user', 'admin'] }, // ⬅️ added role field
  verified: { type: Boolean, default: false }, // ⬅️ added verified field
});

const jwt = require('jsonwebtoken');

const generateEmailToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SECRET, // Create in .env
    { expiresIn: '30m' }
  );
};


module.exports = mongoose.model('User', userSchema);
