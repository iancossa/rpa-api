const express = require('express');
const {signup, login} = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();

// POST /signup
router.post('/signup', signup);
// POST /login  
router.post('/login', login);



//protect routes with auth middleware
const authMiddleware = require('../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('<h2>Verification token missing</h2>');
    }

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send('<h2>User not found</h2>');
    }

    if (user.verified) {
      return res.status(400).send('<h2>User already verified</h2>');
    }

    user.verified = true;
    await user.save();

    res.status(200).send('<h2>Email verified successfully. You can now login.</h2>');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send('<h2>Invalid or expired verification link</h2>');
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