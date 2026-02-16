const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response.utils');

exports.validateCreateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn([
      'Roads & Infrastructure',
      'Healthcare',
      'Education',
      'Smart City',
      'Rural Development',
      'Water Supply',
      'Sanitation',
      'Energy',
      'Others',
    ])
    .withMessage('Invalid department'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('location.city').trim().notEmpty().withMessage('City is required'),

  body('location.state').trim().notEmpty().withMessage('State is required'),

  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),

  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),

  body('totalBudget')
    .isFloat({ min: 0 })
    .withMessage('Total budget must be a positive number'),

  body('startDate').isISO8601().withMessage('Invalid start date'),

  body('expectedEndDate').isISO8601().withMessage('Invalid expected end date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }
    next();
  },
];

exports.validateUpdateProject = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('department')
    .optional()
    .isIn([
      'Roads & Infrastructure',
      'Healthcare',
      'Education',
      'Smart City',
      'Rural Development',
      'Water Supply',
      'Sanitation',
      'Energy',
      'Others',
    ])
    .withMessage('Invalid department'),

  body('totalBudget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total budget must be a positive number'),

  body('amountSpent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount spent must be a positive number'),

  body('completionPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Completion percentage must be between 0 and 100'),

  body('status')
    .optional()
    .isIn(['On Time', 'Delayed', 'Critical', 'Completed'])
    .withMessage('Invalid status'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }
    next();
  },
];
