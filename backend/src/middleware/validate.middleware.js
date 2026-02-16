const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response.utils');

/**
 * Middleware to handle validation errors from express-validator
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};
