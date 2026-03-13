const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Create user (isApproved defaults to false - pending admin review)
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            isApproved: false,
            status: 'pending'
        });

        // Do NOT send token - account needs admin approval first
        res.status(201).json({
            success: true,
            pendingApproval: true,
            message: 'Account created successfully. Your account is under review and you will be notified once approved.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if account is approved (skip check for admin)
        if (!user.isAdmin && !user.isApproved) {
            if (user.status === 'rejected') {
                return res.status(403).json({
                    success: false,
                    error: 'account_rejected',
                    message: 'Your account request was not approved. Please contact support.'
                });
            }
            return res.status(403).json({
                success: false,
                error: 'account_pending',
                message: 'Your account is still under review. Please wait for admin approval.'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        }
    });
};
