const express = require('express');
const {signup, login} = require('../controllers/authController');

const router = express.Router();
// POST /signup
router.post('/signup', signup);
// POST /login  
router.post('/login', login);

//protect routes with auth middleware
const authMiddleware = require('../middleware/authMiddleware');


router.get('/profile',authMiddleware,(req,res)=>{
    res.json({user: req.user})
})

module.exports = router;