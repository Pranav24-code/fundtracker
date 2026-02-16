const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response.utils');

exports.validateComplaint = [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),

  body('issueType')
    .notEmpty()
    .withMessage('Issue type is required')
    .isIn(['Poor Quality', 'Work Stopped', 'Budget Misuse', 'Timeline Delay', 'Other'])
    .withMessage('Invalid issue type'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),

  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }
    next();
  },
];
