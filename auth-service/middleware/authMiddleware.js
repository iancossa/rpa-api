const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Middleware to authenticate JWT token
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const roleMiddleware = (roles) => {}
    return async (req, res, next) => {
        if (!req.user || req.user.role!==requiredRole) {
            return res.status(403).json({ message: 'Access denied:Insufficient permisssions' });
        }
        next();
    }      
module.exports = authMiddleware;    