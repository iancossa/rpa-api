const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Missing token');
    }

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.isVerified) {
      return res.status(200).send('Email already verified.');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send('✅ Email verified successfully!');
  } catch (err) {
    console.error(err);
    res.status(400).send('❌ Invalid or expired token');
  }
};

module.exports = verifyEmail;
