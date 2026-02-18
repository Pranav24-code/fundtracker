const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getNearbyProjects,
  submitProgressUpdate,
  getProjectUpdates,
} = require('../controllers/project.controller');
const { protect, authorize, optionalProtect } = require('../middleware/auth.middleware');
const { uploadMultiple, handleUploadError } = require('../middleware/upload.middleware');
const {
  validateCreateProject,
  validateUpdateProject,
} = require('../validators/project.validator');

// Public routes
router.get('/', optionalProtect, getAllProjects);
router.get('/nearby', getNearbyProjects);
router.get('/:id', getProject);

// Admin only routes
// Create project (Admin or Contractor)
router.post('/', protect, authorize('admin', 'contractor'), validateCreateProject, createProject);
router.put('/:id', protect, authorize('admin'), validateUpdateProject, updateProject);
// Approve project (Admin only)
router.put('/:id/approve', protect, authorize('admin'), require('../controllers/project.controller').approveProject);

router.delete('/:id', protect, authorize('admin'), deleteProject);

// Contractor progress update route
router.post('/:id/update', protect, authorize('contractor'), uploadMultiple, handleUploadError, submitProgressUpdate);

// Claim a project (Contractor)
router.post('/:id/claim', protect, authorize('contractor'), require('../controllers/project.controller').claimProject);

// Get updates for a project (protected)
router.get('/:id/updates', protect, getProjectUpdates);

module.exports = router;
