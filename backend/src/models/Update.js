const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    workDone: {
      type: String,
      maxlength: [1000, 'Work done cannot exceed 1000 characters'],
    },
    issuesFaced: {
      type: String,
      maxlength: [1000, 'Issues faced cannot exceed 1000 characters'],
    },
    nextMilestone: {
      type: String,
      maxlength: [500, 'Next milestone cannot exceed 500 characters'],
    },
    photos: [
      {
        url: String,
        publicId: String,
      },
    ],
    gpsData: {
      lat: Number,
      lng: Number,
      accuracy: Number,
      timestamp: Date,
    },
    distanceFromSite: {
      type: Number,
    },
    isValid: {
      type: Boolean,
    },
    budgetUsedThisUpdate: {
      type: Number,
      min: 0,
    },
    laborCount: {
      type: Number,
      min: 0,
    },
    materialsSummary: {
      type: String,
      maxlength: [1000, 'Materials summary cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
updateSchema.index({ project: 1, createdAt: -1 });
updateSchema.index({ contractor: 1 });

module.exports = mongoose.model('Update', updateSchema);
