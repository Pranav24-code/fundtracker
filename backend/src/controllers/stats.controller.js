const Project = require('../models/Project');
const Complaint = require('../models/Complaint');
const { successResponse, errorResponse } = require('../utils/response.utils');

// @desc    Get overall statistics
// @route   GET /api/stats/overview
// @access  Private (Admin)
exports.getOverviewStats = async (req, res) => {
  try {
    // Total budget allocated
    const totalBudget = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalBudget' } } },
    ]);

    // Total amount spent
    const totalSpent = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$amountSpent' } } },
    ]);

    // Project counts by status
    const projectCounts = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Risk flagged projects
    const riskCount = await Project.countDocuments({
      isActive: true,
      riskFlag: true,
    });

    // Pending complaints
    const pendingComplaints = await Complaint.countDocuments({
      status: 'Pending',
    });

    // Critical complaints
    const criticalComplaints = await Complaint.countDocuments({
      isCritical: true,
      status: { $ne: 'Resolved' },
    });

    // Total complaints
    const totalComplaints = await Complaint.countDocuments();

    return successResponse(res, 'Overview stats retrieved successfully', {
      totalBudgetAllocated: totalBudget[0]?.total || 0,
      totalBudgetSpent: totalSpent[0]?.total || 0,
      utilizationPercentage: totalBudget[0]?.total
        ? ((totalSpent[0]?.total / totalBudget[0]?.total) * 100).toFixed(2)
        : 0,
      projectCounts: projectCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      activeProjects: projectCounts.reduce((sum, item) => sum + item.count, 0),
      riskFlaggedProjects: riskCount,
      pendingComplaints,
      criticalComplaints,
      totalComplaints,
    });
  } catch (error) {
    console.error('Get overview stats error:', error);
    return errorResponse(res, 'Failed to get stats', 500);
  }
};

// @desc    Get budget allocation by department
// @route   GET /api/stats/department-allocation
// @access  Private (Admin)
exports.getDepartmentAllocation = async (req, res) => {
  try {
    const allocation = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          totalBudget: { $sum: '$totalBudget' },
          totalSpent: { $sum: '$amountSpent' },
          projectCount: { $sum: 1 },
        },
      },
      {
        $project: {
          department: '$_id',
          totalBudget: 1,
          totalSpent: 1,
          projectCount: 1,
          utilizationPercentage: {
            $cond: [
              { $eq: ['$totalBudget', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$totalSpent', '$totalBudget'] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { totalBudget: -1 } },
    ]);

    return successResponse(
      res,
      'Department allocation retrieved successfully',
      {
        allocation,
      }
    );
  } catch (error) {
    console.error('Get department allocation error:', error);
    return errorResponse(res, 'Failed to get allocation', 500);
  }
};

// @desc    Get monthly spending trends
// @route   GET /api/stats/monthly-trends
// @access  Private (Admin)
exports.getMonthlyTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const trends = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          totalBudget: 1,
          amountSpent: 1,
        },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          totalAllocated: { $sum: '$totalBudget' },
          totalSpent: { $sum: '$amountSpent' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: parseInt(months) },
    ]);

    return successResponse(res, 'Monthly trends retrieved successfully', {
      trends,
    });
  } catch (error) {
    console.error('Get monthly trends error:', error);
    return errorResponse(res, 'Failed to get trends', 500);
  }
};

// @desc    Get contractor statistics
// @route   GET /api/stats/contractor
// @access  Private (Contractor)
exports.getContractorStats = async (req, res) => {
  try {
    const projects = await Project.find({
      contractor: req.user.id,
      isActive: true,
    });

    const totalProjects = projects.length;
    const completedProjects = projects.filter(
      (p) => p.status === 'Completed'
    ).length;
    const activeProjects = totalProjects - completedProjects;

    const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.amountSpent, 0);

    const avgCompletion =
      totalProjects > 0
        ? projects.reduce((sum, p) => sum + p.completionPercentage, 0) /
          totalProjects
        : 0;

    const delayedProjects = projects.filter(
      (p) => p.status === 'Delayed'
    ).length;

    const riskFlaggedProjects = projects.filter((p) => p.riskFlag).length;

    return successResponse(res, 'Contractor stats retrieved successfully', {
      totalProjects,
      activeProjects,
      completedProjects,
      totalBudgetAssigned: totalBudget,
      totalSpent,
      averageCompletion: avgCompletion.toFixed(2),
      delayedProjects,
      riskFlaggedProjects,
    });
  } catch (error) {
    console.error('Get contractor stats error:', error);
    return errorResponse(res, 'Failed to get stats', 500);
  }
};

// @desc    Get risk breakdown
// @route   GET /api/stats/risk-breakdown
// @access  Private (Admin)
exports.getRiskBreakdown = async (req, res) => {
  try {
    const riskProjects = await Project.find({ isActive: true, riskFlag: true });

    const factorCounts = {};
    riskProjects.forEach((p) => {
      (p.riskFactors || []).forEach((factor) => {
        factorCounts[factor] = (factorCounts[factor] || 0) + 1;
      });
    });

    const breakdown = Object.entries(factorCounts).map(([factor, count]) => ({
      factor,
      count,
    }));

    return successResponse(res, 'Risk breakdown retrieved successfully', {
      breakdown,
      totalRiskFlagged: riskProjects.length,
    });
  } catch (error) {
    console.error('Get risk breakdown error:', error);
    return errorResponse(res, 'Failed to get risk breakdown', 500);
  }
};
