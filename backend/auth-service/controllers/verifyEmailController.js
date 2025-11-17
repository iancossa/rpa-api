// Lazy loading for better performance
let jwt, User;

const loadDependencies = () => {
  if (!jwt) {
    jwt = require('jsonwebtoken');
    User = require('../models/User');
  }
};


const verifyEmail = async (req, res) => {
  loadDependencies();
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Missing token');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(400).send('Invalid or expired token');
    }
    
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.isVerified) {
      return res.status(200).send('Email already verified.');
    }

    try {
      user.isVerified = true;
      await user.save();
    } catch (saveError) {
      console.error('Error saving user verification:', saveError);
      return res.status(500).send('Failed to verify email');
    }

    res.status(200).send('✅ Email verified successfully!');
  } catch (err) {
    console.error('Email verification error:', {
      error: err.message,
      stack: err.stack,
      userId: err.userId || 'unknown'
    });
    res.status(400).send('❌ Invalid or expired token');
  }
};

module.exports = verifyEmail;
