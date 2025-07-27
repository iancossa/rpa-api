const express = require('express');
const {signup, login} = require('../controllers/authController');
const User = require('../models/User');


const router = express.Router();

// POST /signup
router.post('/signup', signup);
// POST /login  
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Check if verified
    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, message: 'Login successful' });

  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//protect routes with auth middleware
const authMiddleware = require('../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

router.get('/verify-email', async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).send('User not found');
    if (user.verified) return res.status(400).send('User already verified');

    user.verified = true;
    await user.save();

    res.status(200).send('Email verified successfully');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       403:
 *         description: Email not verified
 */




module.exports = router;