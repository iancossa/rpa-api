const express = require('express');
const route= express.Router();
const User  = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = require('./authRoute');



//PATCH /admin/assign-role

route.patch('/assign-role', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    const {email,role }=req.body;
    try{
        const user = await User.findOneAndUpdate({email}, {role}, {new: true});
        if(!user)return res.status(404).json({message: 'User not found'});
        res.json({message: 'Role assigned successfully', user});            
    }catch(error) {
        console.error('Error assigning role:', error);
        res.status(500).json({message: 'Internal server error'});
    }

});

module.exports = route;