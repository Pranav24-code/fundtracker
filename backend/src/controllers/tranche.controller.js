const PaymentTranche = require('../models/PaymentTranche');
const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/response.utils');

// @desc    Get tranches by project
// @route   GET /api/tranches?projectId=xxx
// @access  Private
exports.getTranches = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return errorResponse(res, 'Project ID is required', 400);
    }

    const tranches = await PaymentTranche.find({ project: projectId })
      .populate('releasedBy', 'name')
      .sort({ trancheNumber: 1 });

    return successResponse(res, 'Tranches retrieved successfully', { tranches });
  } catch (error) {
    console.error('Get tranches error:', error);
    return errorResponse(res, 'Failed to get tranches', 500);
  }
};

// @desc    Create tranche
// @route   POST /api/tranches
// @access  Private (Admin only)
exports.createTranche = async (req, res) => {
  try {
    const { projectId, trancheNumber, amount, releaseDate, conditions } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    const tranche = await PaymentTranche.create({
      project: projectId,
      trancheNumber,
      amount,
      releaseDate,
      conditions,
    });

    return successResponse(res, 'Tranche created successfully', { tranche }, 201);
  } catch (error) {
    console.error('Create tranche error:', error);
    return errorResponse(res, 'Failed to create tranche', 500);
  }
};

// @desc    Update tranche
// @route   PUT /api/tranches/:id
// @access  Private (Admin only)
exports.updateTranche = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const tranche = await PaymentTranche.findById(req.params.id);

    if (!tranche) {
      return errorResponse(res, 'Tranche not found', 404);
    }

    // If releasing, update project budget.released
    if (status === 'released' && tranche.status !== 'released') {
      tranche.releasedBy = req.user.id;
      tranche.releaseDate = new Date();
    }

    if (status) tranche.status = status;
    if (notes) tranche.notes = notes;
    await tranche.save();

    return successResponse(res, 'Tranche updated successfully', { tranche });
  } catch (error) {
    console.error('Update tranche error:', error);
    return errorResponse(res, 'Failed to update tranche', 500);
  }
};

// @desc    Delete tranche
// @route   DELETE /api/tranches/:id
// @access  Private (Admin only)
exports.deleteTranche = async (req, res) => {
  try {
    const tranche = await PaymentTranche.findById(req.params.id);

    if (!tranche) {
      return errorResponse(res, 'Tranche not found', 404);
    }

    if (tranche.status !== 'pending') {
      return errorResponse(res, 'Can only delete pending tranches', 400);
    }

    await PaymentTranche.findByIdAndDelete(req.params.id);
    return successResponse(res, 'Tranche deleted successfully');
  } catch (error) {
    console.error('Delete tranche error:', error);
    return errorResponse(res, 'Failed to delete tranche', 500);
  }
};
