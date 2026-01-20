const express = require('express');
const router = express.Router();
const {
    addFavorite,
    getFavorites,
    removeFavorite,
    submitInquiry,
    getInquiries,
    scheduleVisit,
    getVisits
} = require('../controllers/buyerController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for buyers
router.use(protect);
router.use(authorize('buyer'));

// Favorites
router.route('/favorites')
    .get(getFavorites)
    .post(addFavorite);

router.delete('/favorites/:propertyId', removeFavorite);

// Inquiries
router.route('/inquiries')
    .get(getInquiries)
    .post(submitInquiry);

// Visits
router.route('/visits')
    .get(getVisits)
    .post(scheduleVisit);

module.exports = router;
