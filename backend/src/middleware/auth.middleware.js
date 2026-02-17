const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response.utils');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookie first, then header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return errorResponse(res, 'User not found', 404);
      }

      if (!req.user.isActive) {
        return errorResponse(res, 'Account is deactivated', 403);
      }

      next();
    } catch (error) {
      return errorResponse(res, 'Invalid token', 401);
    }
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 500);
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};
