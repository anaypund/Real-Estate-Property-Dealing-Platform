const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    adminLogin,
    getStats,
    getSignupRequests,
    getAllUsers,
    getUserDetail,
    approveUser,
    rejectUser
} = require('../controllers/adminController');

// Middleware to verify admin JWT token
const adminProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Public route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/stats', adminProtect, getStats);
router.get('/signup-requests', adminProtect, getSignupRequests);
router.get('/users', adminProtect, getAllUsers);
router.get('/users/:id', adminProtect, getUserDetail);
router.put('/approve/:id', adminProtect, approveUser);
router.put('/reject/:id', adminProtect, rejectUser);

module.exports = router;
