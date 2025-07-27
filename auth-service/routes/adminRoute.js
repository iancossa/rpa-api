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

/**
 * @swagger
 * /admin/assign-role:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user, viewer]
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /admin/all-users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       403:
 *         description: Unauthorized
 */
