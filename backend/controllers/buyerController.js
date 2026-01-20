const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');
const Visit = require('../models/Visit');
const Property = require('../models/Property');

// @desc    Add property to favorites
// @route   POST /api/buyers/favorites
// @access  Private
exports.addFavorite = async (req, res, next) => {
    try {
        const { propertyId } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            property: propertyId
        });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                error: 'Property already in favorites'
            });
        }

        const favorite = await Favorite.create({
            user: req.user.id,
            property: propertyId
        });

        res.status(201).json({
            success: true,
            data: favorite
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's favorites
// @route   GET /api/buyers/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .populate({
                path: 'property',
                select: 'title price location bedrooms bathrooms sqft images status propertyType'
            })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove from favorites
// @route   DELETE /api/buyers/favorites/:propertyId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            user: req.user.id,
            property: req.params.propertyId
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                error: 'Favorite not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit inquiry
// @route   POST /api/buyers/inquiries
// @access  Private
exports.submitInquiry = async (req, res, next) => {
    try {
        const { propertyId, message } = req.body;

        // Get property to find seller
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        const inquiry = await Inquiry.create({
            property: propertyId,
            buyer: req.user.id,
            seller: property.seller,
            message,
            buyerName: req.user.name,
            buyerEmail: req.user.email,
            buyerPhone: req.user.phone || ''
        });

        res.status(201).json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get buyer's inquiries
// @route   GET /api/buyers/inquiries
// @access  Private
exports.getInquiries = async (req, res, next) => {
    try {
        const inquiries = await Inquiry.find({ buyer: req.user.id })
            .populate('property', 'title price location images')
            .populate('seller', 'name email phone')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Schedule visit
// @route   POST /api/buyers/visits
// @access  Private
exports.scheduleVisit = async (req, res, next) => {
    try {
        const { propertyId, visitDate, visitTime, notes } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        const visit = await Visit.create({
            property: propertyId,
            buyer: req.user.id,
            visitDate,
            visitTime,
            notes
        });

        res.status(201).json({
            success: true,
            data: visit
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get buyer's visits
// @route   GET /api/buyers/visits
// @access  Private
exports.getVisits = async (req, res, next) => {
    try {
        const visits = await Visit.find({ buyer: req.user.id })
            .populate('property', 'title location images seller')
            .sort('visitDate');

        res.status(200).json({
            success: true,
            count: visits.length,
            data: visits
        });
    } catch (error) {
        next(error);
    }
};
