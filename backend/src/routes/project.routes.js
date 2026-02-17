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
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadMultiple, handleUploadError } = require('../middleware/upload.middleware');
const {
  validateCreateProject,
  validateUpdateProject,
} = require('../validators/project.validator');

// Public routes
router.get('/', getAllProjects);
router.get('/nearby', getNearbyProjects);
router.get('/:id', getProject);

// Admin only routes
router.post('/', protect, authorize('admin'), validateCreateProject, createProject);
router.put('/:id', protect, authorize('admin'), validateUpdateProject, updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

// Contractor progress update route
router.post('/:id/update', protect, authorize('contractor'), uploadMultiple, handleUploadError, submitProgressUpdate);

// Get updates for a project (protected)
router.get('/:id/updates', protect, getProjectUpdates);

module.exports = router;
