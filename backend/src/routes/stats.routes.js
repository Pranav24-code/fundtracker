const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  getDepartmentAllocation,
  getMonthlyTrends,
  getContractorStats,
  getRiskBreakdown,
} = require('../controllers/stats.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All stats routes require authentication
router.use(protect);

// Admin routes
router.get('/overview', authorize('admin'), getOverviewStats);
router.get('/department-allocation', authorize('admin'), getDepartmentAllocation);
router.get('/monthly-trends', authorize('admin'), getMonthlyTrends);
router.get('/risk-breakdown', authorize('admin'), getRiskBreakdown);

// Contractor routes
router.get('/contractor', authorize('contractor'), getContractorStats);

module.exports = router;
