const Complaint = require('../models/Complaint');
const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Submit complaint
// @route   POST /api/complaints
// @access  Private (Citizen only)
exports.submitComplaint = async (req, res) => {
  try {
    const { projectId, issueType, description, latitude, longitude } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'petms/complaints');
          images.push({
            url: result.url,
            publicId: result.publicId,
          });
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }

        // Delete local file
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          // ignore
        }
      }
    }

    // Create complaint
    const complaint = await Complaint.create({
      project: projectId,
      citizen: req.user.id,
      issueType,
      description,
      images,
      location: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      },
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    // Gamification & Blacklist Logic
    try {
      // 1. Update Citizen: Increment complaint count and check for points
      const User = require('../models/User');
      const citizen = await User.findById(req.user.id);
      citizen.complaintCount = (citizen.complaintCount || 0) + 1;

      // Award 50 points for every 15 complaints
      if (citizen.complaintCount % 15 === 0) {
        citizen.points = (citizen.points || 0) + 50;
      }
      await citizen.save();

      // 2. Update Contractor: Increment complaint count and check for blacklist
      if (project.contractor) {
        const contractor = await User.findById(project.contractor);
        if (contractor) {
          contractor.complaintCount = (contractor.complaintCount || 0) + 1;

          // Blacklist if 10 or more complaints
          if (contractor.complaintCount >= 10) {
            contractor.isBlacklisted = true;
          }
          await contractor.save();
        }
      }
    } catch (gamificationError) {
      console.error('Gamification error:', gamificationError);
      // Don't fail the request if gamification fails
    }

    await complaint.populate('project', 'title location');
    await complaint.populate('citizen', 'name email');

    return successResponse(
      res,
      'Complaint submitted successfully',
      {
        complaint,
        trackingId: complaint.trackingId,
        pointsAwarded: (req.user.complaintCount + 1) % 15 === 0 ? 50 : 0
      },
      201
    );
  } catch (error) {
    console.error('Submit complaint error:', error);
    return errorResponse(res, 'Failed to submit complaint', 500);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getAllComplaints = async (req, res) => {
  try {
    const {
      projectId,
      status,
      isCritical,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filters
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (isCritical !== undefined) query.isCritical = isCritical === 'true';

    // Role-based filtering
    if (req.user.role === 'citizen') {
      query.citizen = req.user.id;
    }

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(query)
      .populate('project', 'title location department')
      .populate('citizen', 'name email')
      .populate('adminResponse.respondedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    return successResponse(res, 'Complaints retrieved successfully', {
      complaints,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    return errorResponse(res, 'Failed to get complaints', 500);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('project', 'title location department')
      .populate('citizen', 'name email phone')
      .populate('adminResponse.respondedBy', 'name email');

    if (!complaint) {
      return errorResponse(res, 'Complaint not found', 404);
    }

    // Check authorization - citizens can only view their own
    if (
      req.user.role === 'citizen' &&
      complaint.citizen._id.toString() !== req.user.id
    ) {
      return errorResponse(res, 'Not authorized to view this complaint', 403);
    }

    return successResponse(res, 'Complaint retrieved successfully', {
      complaint,
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    return errorResponse(res, 'Failed to get complaint', 500);
  }
};

// @desc    Upvote complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private (Citizen only)
exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return errorResponse(res, 'Complaint not found', 404);
    }

    // Check if already upvoted
    const alreadyUpvoted = complaint.upvotedBy.includes(req.user.id);

    if (alreadyUpvoted) {
      // Remove upvote
      complaint.upvotedBy = complaint.upvotedBy.filter(
        (id) => id.toString() !== req.user.id
      );
      complaint.upvotes -= 1;
    } else {
      // Add upvote
      complaint.upvotedBy.push(req.user.id);
      complaint.upvotes += 1;
    }

    await complaint.save();

    return successResponse(
      res,
      alreadyUpvoted ? 'Upvote removed' : 'Complaint upvoted',
      {
        upvotes: complaint.upvotes,
        hasUpvoted: !alreadyUpvoted,
      }
    );
  } catch (error) {
    console.error('Upvote error:', error);
    return errorResponse(res, 'Failed to upvote complaint', 500);
  }
};

// @desc    Respond to complaint (Admin)
// @route   PUT /api/complaints/:id/respond
// @access  Private (Admin only)
exports.respondToComplaint = async (req, res) => {
  try {
    const { message, status } = req.body;
    console.log(`Responding to complaint ${req.params.id} by user ${req.user.id}`);

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return errorResponse(res, 'Complaint not found', 404);
    }

    complaint.adminResponse = {
      message,
      respondedBy: req.user.id,
      respondedAt: new Date(),
    };

    if (status) {
      complaint.status = status;
    }

    await complaint.save();
    console.log('Complaint saved successfully');

    await complaint.populate('adminResponse.respondedBy', 'name email');

    return successResponse(res, 'Response added successfully', { complaint });
  } catch (error) {
    console.error('Respond error:', error);
    return errorResponse(res, 'Failed to respond to complaint: ' + error.message, 500);
  }
};
