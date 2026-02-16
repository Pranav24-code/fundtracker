const multer = require('multer');
const path = require('path');
const { FILE_LIMITS } = require('../config/constants');
const { errorResponse } = require('../utils/response.utils');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (FILE_LIMITS.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: FILE_LIMITS.MAX_FILE_SIZE,
  },
  fileFilter,
});

// Error handling middleware
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large. Maximum size is 5MB.', 400);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return errorResponse(
        res,
        `Maximum ${FILE_LIMITS.MAX_FILES_PER_UPLOAD} files allowed.`,
        400
      );
    }
    return errorResponse(res, err.message, 400);
  } else if (err) {
    return errorResponse(res, err.message, 400);
  }
  next();
};

// Export upload instances
exports.uploadSingle = upload.single('image');
exports.uploadMultiple = upload.array('images', FILE_LIMITS.MAX_FILES_PER_UPLOAD);
