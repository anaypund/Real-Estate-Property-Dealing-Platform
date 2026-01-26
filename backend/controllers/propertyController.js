const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
    try {
        const {
            city,
            minPrice,
            maxPrice,
            bedrooms,
            propertyType,
            amenities,
            status,
            seller,
            search,
            page = 1,
            limit = 10,
            sort = '-createdAt'
        } = req.query;

        // Build query
        let query = {};

        // Global search across multiple fields
        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // Extract bedroom number if search contains "bhk" or bedroom-related terms
            const bedroomMatch = search.match(/(\d+)\s*bhk/i);
            const bedroomNumber = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { 'location.address': searchRegex },
                { 'location.city': searchRegex },
                { 'location.state': searchRegex },
                { 'location.zipCode': searchRegex }
            ];

            // Add bedroom search if number found
            if (bedroomNumber) {
                query.$or.push({ bedrooms: bedroomNumber });
            }
        }

        if (city) query['location.city'] = new RegExp(city, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }
        if (bedrooms) query.bedrooms = { $gte: bedrooms };
        if (propertyType) query.propertyType = propertyType;
        if (seller) query.seller = seller; // Filter by seller ID
        if (status) query.status = status;
        else if (!seller) query.status = 'active'; // Default to active properties only if not filtering by seller

        if (amenities) {
            const amenitiesArray = amenities.split(',');
            query.amenities = { $all: amenitiesArray };
        }

        // Execute query with pagination
        const properties = await Property.find(query)
            .populate('seller', 'name email phone')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sort);

        // Get total count
        const count = await Property.countDocuments(query);

        res.status(200).json({
            success: true,
            count: properties.length,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: properties
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('seller', 'name email phone profilePicture');

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // Increment views
        property.views += 1;
        await property.save();

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Seller only)
exports.createProperty = async (req, res, next) => {
    try {
        // Add seller to req.body
        req.body.seller = req.user.id;

        // Handle image uploads if present
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => file.filename);
        }

        const property = await Property.create(req.body);

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
exports.updateProperty = async (req, res, next) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // Make sure user is property owner
        if (property.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this property'
            });
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.filename);
            req.body.images = [...property.images, ...newImages];
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
exports.deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // Make sure user is property owner
        if (property.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this property'
            });
        }

        await property.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res, next) => {
    try {
        const properties = await Property.find({ featured: true, status: 'active' })
            .populate('seller', 'name email')
            .limit(6)
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        next(error);
    }
};
