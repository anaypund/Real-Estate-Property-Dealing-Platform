const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getLeads,
    updateLeadStatus,
    getAnalytics
} = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for sellers
router.use(protect);
router.use(authorize('seller', 'agent'));

router.get('/dashboard', getDashboardStats);
router.get('/leads', getLeads);
router.put('/leads/:id', updateLeadStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
