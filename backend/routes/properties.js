const express = require('express');
const router = express.Router();
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getFeaturedProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getProperty);

// Protected routes (Seller only)
router.post('/', protect, authorize('seller', 'agent'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorize('seller', 'agent'), upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorize('seller', 'agent'), deleteProperty);

module.exports = router;
