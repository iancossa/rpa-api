const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendVerificationEmail = require('../utils/emailSender');
const generateEmailToken = require('../utils/generateEmail');
const { notifyUserRegistration } = require('../utils/automationService');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user with verified=false
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verified: false, // REQUIRED for email verification
    });
    await newUser.save();

    // 4. Generate email verification token
    const emailToken = generateEmailToken(newUser);

    // 5. Send email
    await sendVerificationEmail(newUser, emailToken);

    // 6. Notify automation service
    await notifyUserRegistration({
      id: newUser._id,
      email: newUser.email,
      username: newUser.username
    });

    // 7. Respond
    res.status(201).json({ message: 'User registered. Please verify your email.' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check email verification
    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token missing' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    user.verified = true;
    await user.save();

    res.status(200).send('<h2>Email verified successfully. You can now login.</h2>');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send('<h2>Invalid or expired verification link</h2>');
  }
};
