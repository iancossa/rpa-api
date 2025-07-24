const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

//Post/signup

exports.signup = async (req, res) => {
    try {
        const { username,email, password } = req.body;
        //Check if user already exists
        const existingUser = await User.findOne({ email }); // Assuming you have a User model
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        //Hash the password
        const hashedPassword = await bycrpt.hash(password, 10);
        //Create new user
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });    
    }catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

};

//Post/login:Valdate user credentials and generate JWT token
//POST /login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check if user exists
        const user = await User.findOne({ email }); // Assuming you have a User model
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //Validate password
        const isPasswordValid = await bycrpt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};