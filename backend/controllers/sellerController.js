const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Visit = require('../models/Visit');

// @desc    Get seller dashboard statistics
// @route   GET /api/sellers/dashboard
// @access  Private (Seller only)
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get seller's properties
        const properties = await Property.find({ seller: req.user.id });
        const propertyIds = properties.map(p => p._id);

        // Calculate total views
        const totalViews = properties.reduce((sum, prop) => sum + prop.views, 0);

        // Get leads count
        const totalLeads = await Inquiry.countDocuments({ seller: req.user.id });
        const newLeads = await Inquiry.countDocuments({
            seller: req.user.id,
            status: 'new'
        });

        // Get active campaigns (properties)
        const activeCampaigns = await Property.countDocuments({
            seller: req.user.id,
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                totalViews,
                totalLeads,
                newLeads,
                activeCampaigns,
                totalProperties: properties.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get leads for seller properties
// @route   GET /api/sellers/leads
// @access  Private (Seller only)
exports.getLeads = async (req, res, next) => {
    try {
        // Get seller's properties to filter leads
        const properties = await Property.find({ seller: req.user.id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        // Get inquiries
        const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
            .populate('property', 'title price location images')
            .populate('buyer', 'name email phone')
            .sort('-createdAt')
            .lean();

        // Get visits
        const visits = await Visit.find({ property: { $in: propertyIds } })
            .populate('property', 'title price location images')
            .populate('buyer', 'name email phone')
            .sort('-createdAt')
            .lean();

        // Add type identifier to each lead
        const inquiryLeads = inquiries.map(inquiry => ({ ...inquiry, type: 'inquiry' }));
        const visitLeads = visits.map(visit => ({ ...visit, type: 'visit' }));

        // Combine and sort by date
        const allLeads = [...inquiryLeads, ...visitLeads].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            count: allLeads.length,
            data: allLeads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead status
// @route   PUT /api/sellers/leads/:id
// @access  Private (Seller only)
exports.updateLeadStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        let lead = await Inquiry.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }

        // Make sure seller owns this lead
        if (lead.seller.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this lead'
            });
        }

        lead = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get analytics data
// @route   GET /api/sellers/analytics
// @access  Private (Seller only)
exports.getAnalytics = async (req, res, next) => {
    try {
        // Get properties with their stats
        const properties = await Property.find({ seller: req.user.id })
            .select('title views status createdAt');

        // Get leads grouped by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const leadsByMonth = await Inquiry.aggregate([
            {
                $match: {
                    seller: req.user._id,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get property status breakdown
        const statusBreakdown = await Property.aggregate([
            {
                $match: { seller: req.user._id }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                properties,
                leadsByMonth,
                statusBreakdown
            }
        });
    } catch (error) {
        next(error);
    }
};
