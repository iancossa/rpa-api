const bycrpt = require('bcrypt');
//const User = require('../models/User'); // Assuming you have a User model

//Post/signup

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
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