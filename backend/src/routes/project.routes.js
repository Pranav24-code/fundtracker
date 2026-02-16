const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getNearbyProjects,
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
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

module.exports = router;
