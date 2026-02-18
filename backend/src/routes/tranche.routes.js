const express = require('express');
const router = express.Router();
const {
  getTranches,
  createTranche,
  updateTranche,
  deleteTranche,
} = require('../controllers/tranche.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All tranche routes require auth
router.use(protect);

// Get tranches (any authenticated user)
router.get('/', getTranches);

// Admin only
router.post('/', authorize('admin'), createTranche);
router.put('/:id', authorize('admin'), updateTranche);
router.delete('/:id', authorize('admin'), deleteTranche);

module.exports = router;
