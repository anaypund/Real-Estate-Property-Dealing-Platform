const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin@123';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            error: 'Invalid admin credentials'
        });
    }

    // Create a JWT for admin session
    const token = jwt.sign(
        { id: 'admin', isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.status(200).json({
        success: true,
        token,
        user: {
            id: 'admin',
            name: 'Administrator',
            role: 'admin',
            isAdmin: true
        }
    });
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
    try {
        const totalBuyers = await User.countDocuments({ role: 'buyer' });
        const totalSellers = await User.countDocuments({ role: { $in: ['seller', 'agent'] } });
        const pendingRequests = await User.countDocuments({ status: 'pending' });
        const approvedUsers = await User.countDocuments({ status: 'approved' });
        const rejectedUsers = await User.countDocuments({ status: 'rejected' });

        res.status(200).json({
            success: true,
            data: {
                totalBuyers,
                totalSellers,
                pendingRequests,
                approvedUsers,
                rejectedUsers,
                totalUsers: totalBuyers + totalSellers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all signup requests (pending users)
// @route   GET /api/admin/signup-requests
// @access  Admin
exports.getSignupRequests = async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all users (for overview)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single user detail
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Approve a user signup request
// @route   PUT /api/admin/approve/:id
// @access  Admin
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true, status: 'approved' },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.name} has been approved successfully.`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Reject a user signup request
// @route   PUT /api/admin/reject/:id
// @access  Admin
exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: false, status: 'rejected' },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.name} has been rejected.`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
