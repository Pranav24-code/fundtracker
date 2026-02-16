const { errorResponse } = require('../utils/response.utils');

/**
 * Role-based access control middleware
 */

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 'Access denied. Admin only.', 403);
};

exports.isContractor = (req, res, next) => {
  if (req.user && req.user.role === 'contractor') {
    return next();
  }
  return errorResponse(res, 'Access denied. Contractor only.', 403);
};

exports.isCitizen = (req, res, next) => {
  if (req.user && req.user.role === 'citizen') {
    return next();
  }
  return errorResponse(res, 'Access denied. Citizen only.', 403);
};

exports.isAdminOrContractor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'contractor')) {
    return next();
  }
  return errorResponse(res, 'Access denied. Admin or Contractor only.', 403);
};
