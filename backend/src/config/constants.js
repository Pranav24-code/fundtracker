module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    CONTRACTOR: 'contractor',
    CITIZEN: 'citizen',
  },

  // Project Status
  PROJECT_STATUS: {
    ON_TIME: 'On Time',
    DELAYED: 'Delayed',
    CRITICAL: 'Critical',
    COMPLETED: 'Completed',
  },

  // Complaint Status
  COMPLAINT_STATUS: {
    PENDING: 'Pending',
    UNDER_REVIEW: 'Under Review',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  },

  // Departments
  DEPARTMENTS: [
    'Roads & Infrastructure',
    'Healthcare',
    'Education',
    'Smart City',
    'Rural Development',
    'Water Supply',
    'Sanitation',
    'Energy',
    'Others',
  ],

  // Red Flag Thresholds
  RED_FLAG_THRESHOLDS: {
    BUDGET_OVERRUN_PERCENT: 90,
    COMPLETION_LAG_PERCENT: 50,
    DELAY_DAYS: 30,
    BUDGET_SPIKE_PERCENT: 20,
    GPS_MAX_DISTANCE_KM: parseFloat(process.env.MAX_GPS_DISTANCE_KM) || 5,
    CRITICAL_UPVOTES: 100,
  },

  // File Upload Limits
  FILE_LIMITS: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
    MAX_FILES_PER_UPLOAD: 5,
  },
};
