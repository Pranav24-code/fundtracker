const Project = require('../models/Project');
const Update = require('../models/Update');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { calculateRiskFlag } = require('../utils/redFlag.utils');
const { calculateDistance } = require('../utils/gps.utils');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendEmail } = require('../utils/email.utils');
const fs = require('fs');

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

    // Role-based filtering
    if (!req.user || req.user.role === 'citizen') {
      query.approvalStatus = 'Approved';
    } else {
      // Admin/Contractor can see pending, support filtering
      if (req.query.approvalStatus) query.approvalStatus = req.query.approvalStatus;
    }
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
// @access  Private (Admin or Contractor)
exports.createProject = async (req, res) => {
  try {
    console.log('Creating project. Body:', req.body);
    console.log('User:', req.user);

    // If contractor is creating, assign them automatically
    if (req.user.role === 'contractor') {
      req.body.contractor = req.user.id;
      req.body.status = 'Planned'; // Changed from 'In Progress' to 'Planned' until approved
      req.body.approvalStatus = 'Pending';
      req.body.startDate = Date.now();
    } else if (req.user.role === 'admin') {
      req.body.approvalStatus = 'Approved';
    }

    const project = await Project.create(req.body);

    return successResponse(
      res,
      'Project created successfully',
      { project },
      201
    );
  } catch (error) {
    console.error('Create project error:', error);
    return errorResponse(res, 'Failed to create project: ' + error.message, 500);
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

// @desc    Submit progress update (Contractor)
// @route   POST /api/projects/:id/update
// @access  Private (Contractor only)
exports.submitProgressUpdate = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Verify contractor is assigned to this project
    if (!project.contractor || project.contractor.toString() !== req.user.id) {
      return errorResponse(res, 'You are not assigned to this project', 403);
    }

    const {
      description,
      progressPercentage,
      workDone,
      issuesFaced,
      nextMilestone,
      budgetUsedThisUpdate,
      laborCount,
      materialsSummary,
      gpsData,
    } = req.body;

    // Upload photos to Cloudinary
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'petms/updates');
          photos.push({ url: result.url, publicId: result.publicId });
        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
        }
        try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      }
    }

    // GPS validation
    let distanceFromSite = null;
    let isValid = null;
    const parsedGps = typeof gpsData === 'string' ? JSON.parse(gpsData) : gpsData;

    if (parsedGps && parsedGps.lat && parsedGps.lng && project.location && project.location.coordinates) {
      const dist = calculateDistance(
        { latitude: parsedGps.lat, longitude: parsedGps.lng },
        { latitude: project.location.coordinates.latitude, longitude: project.location.coordinates.longitude }
      );
      distanceFromSite = Math.round(dist * 1000); // convert km to meters
      isValid = distanceFromSite <= 500; // 500 meters radius
    }

    const update = await Update.create({
      project: project._id,
      contractor: req.user.id,
      description,
      progressPercentage: progressPercentage ? parseInt(progressPercentage) : project.completionPercentage,
      workDone,
      issuesFaced,
      nextMilestone,
      photos,
      gpsData: parsedGps || undefined,
      distanceFromSite,
      isValid,
      budgetUsedThisUpdate: budgetUsedThisUpdate ? parseFloat(budgetUsedThisUpdate) : undefined,
      laborCount: laborCount ? parseInt(laborCount) : undefined,
      materialsSummary,
    });

    // Update project progress
    if (progressPercentage) {
      const newProgress = parseInt(progressPercentage);
      project.completionPercentage = newProgress;
      if (newProgress >= 100 && project.status !== 'Completed') {
        project.status = 'Completed';
        project.actualEndDate = new Date();
      }
      await project.save();
    }

    // Send email notification to admin (non-blocking)
    sendEmail({
      to: process.env.SMTP_USER,
      subject: `Progress Update: ${project.title}`,
      html: `<h3>New Progress Update</h3><p>Project: ${project.title}</p><p>Progress: ${progressPercentage}%</p><p>${description}</p>`,
    }).catch(() => { });

    return successResponse(res, 'Progress update submitted successfully', {
      update,
      gpsValidation: distanceFromSite !== null ? {
        distanceMeters: distanceFromSite,
        isValid,
        message: isValid
          ? `GPS Verified: You are within ${distanceFromSite}m of the project site`
          : `GPS Warning: You appear to be ${(distanceFromSite / 1000).toFixed(1)}km from the project site`,
      } : null,
    }, 201);
  } catch (error) {
    console.error('Submit update error:', error);
    return errorResponse(res, 'Failed to submit progress update', 500);
  }
};

// @desc    Get project updates
// @route   GET /api/projects/:id/updates
// @access  Private
exports.getProjectUpdates = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const updates = await Update.find({ project: req.params.id })
      .populate('contractor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Update.countDocuments({ project: req.params.id });

    return successResponse(res, 'Updates retrieved successfully', {
      updates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get updates error:', error);
    return errorResponse(res, 'Failed to get updates', 500);
  }
};

// @desc    Claim a project (Contractor)
// @route   POST /api/projects/:id/claim
// @access  Private (Contractor only)
exports.claimProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Check if project is already assigned
    if (project.contractor) {
      return errorResponse(res, 'Project is already assigned to a contractor', 400);
    }

    // Assign contractor
    project.contractor = req.user.id;
    project.status = 'In Progress'; // Automatically set status to In Progress
    project.startDate = Date.now(); // Set start date
    await project.save();

    return successResponse(res, 'Project claimed successfully', { project });
  } catch (error) {
    console.error('Claim project error:', error);
    return errorResponse(res, 'Failed to claim project', 500);
  }
};

module.exports = exports;

// @desc    Approve or Reject project
// @route   PUT /api/projects/:id/approve
// @access  Private (Admin only)
exports.approveProject = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    project.approvalStatus = status;

    // If approved, set to 'In Progress' if it was 'Planned'
    if (status === 'Approved' && project.status === 'Planned') {
      project.status = 'In Progress';
    }

    await project.save();

    return successResponse(res, `Project ${status.toLowerCase()} successfully`, { project });
  } catch (error) {
    console.error('Approve project error:', error);
    return errorResponse(res, 'Failed to update project status', 500);
  }
};
