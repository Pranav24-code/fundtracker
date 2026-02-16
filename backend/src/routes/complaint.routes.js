const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getComplaint,
  upvoteComplaint,
  respondToComplaint,
} = require('../controllers/complaint.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadMultiple, handleUploadError } = require('../middleware/upload.middleware');
const { validateComplaint } = require('../validators/complaint.validator');

// All complaint routes require authentication
router.use(protect);

// Get all complaints (filtered by role)
router.get('/', getAllComplaints);

// Get single complaint
router.get('/:id', getComplaint);

// Submit complaint (Citizen only)
router.post(
  '/',
  authorize('citizen'),
  uploadMultiple,
  handleUploadError,
  validateComplaint,
  submitComplaint
);

// Upvote complaint (Citizen only)
router.post('/:id/upvote', authorize('citizen'), upvoteComplaint);

// Respond to complaint (Admin only)
router.put('/:id/respond', authorize('admin'), respondToComplaint);

module.exports = router;
