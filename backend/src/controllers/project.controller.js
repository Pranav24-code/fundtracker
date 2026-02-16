const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { calculateRiskFlag } = require('../utils/redFlag.utils');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = async (req, res) => {
  try {
    const {
      department,
      status,
      riskFlag,
      city,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (department) query.department = department;
    if (status) query.status = status;
    if (riskFlag !== undefined) query.riskFlag = riskFlag === 'true';
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const projects = await Project.find(query)
      .populate('contractor', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    return successResponse(res, 'Projects retrieved successfully', {
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return errorResponse(res, 'Failed to get projects', 500);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'contractor',
      'name email phone'
    );

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    return successResponse(res, 'Project retrieved successfully', { project });
  } catch (error) {
    console.error('Get project error:', error);
    return errorResponse(res, 'Failed to get project', 500);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    return successResponse(
      res,
      'Project created successfully',
      { project },
      201
    );
  } catch (error) {
    console.error('Create project error:', error);
    return errorResponse(res, 'Failed to create project', 500);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Track budget changes
    if (req.body.totalBudget && req.body.totalBudget !== project.totalBudget) {
      project.budgetHistory.push({
        amount: req.body.totalBudget,
        reason: req.body.budgetChangeReason || 'Budget updated',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Recalculate risk flag
    const riskData = calculateRiskFlag(project);
    project.riskFlag = riskData.isRisky;
    project.riskFactors = riskData.factors;
    await project.save();

    return successResponse(res, 'Project updated successfully', { project });
  } catch (error) {
    console.error('Update project error:', error);
    return errorResponse(res, 'Failed to update project', 500);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Soft delete
    project.isActive = false;
    await project.save();

    return successResponse(res, 'Project deleted successfully');
  } catch (error) {
    console.error('Delete project error:', error);
    return errorResponse(res, 'Failed to delete project', 500);
  }
};

// @desc    Get projects by proximity
// @route   GET /api/projects/nearby
// @access  Public
exports.getNearbyProjects = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    // Use simple distance filtering since we store lat/lng as plain numbers
    const projects = await Project.find({ isActive: true }).populate(
      'contractor',
      'name email'
    );

    // Filter by distance using Haversine formula
    const toRad = (value) => (value * Math.PI) / 180;
    const lat1 = parseFloat(latitude);
    const lon1 = parseFloat(longitude);
    const maxDist = parseFloat(radius);

    const nearbyProjects = projects.filter((project) => {
      if (
        !project.location ||
        !project.location.coordinates ||
        !project.location.coordinates.latitude
      ) {
        return false;
      }

      const lat2 = project.location.coordinates.latitude;
      const lon2 = project.location.coordinates.longitude;

      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= maxDist;
    });

    return successResponse(res, 'Nearby projects retrieved successfully', {
      projects: nearbyProjects,
      count: nearbyProjects.length,
    });
  } catch (error) {
    console.error('Get nearby projects error:', error);
    return errorResponse(res, 'Failed to get nearby projects', 500);
  }
};
