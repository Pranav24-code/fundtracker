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
    previousCompletion: {
      type: Number,
      required: true,
    },
    newCompletion: {
      type: Number,
      required: true,
    },
    previousAmountSpent: {
      type: Number,
      required: true,
    },
    newAmountSpent: {
      type: Number,
      required: true,
    },
    photos: [
      {
        url: String,
        publicId: String,
        gpsData: {
          latitude: Number,
          longitude: Number,
        },
        distanceFromSite: Number,
        isValid: Boolean,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
updateSchema.index({ project: 1 });
updateSchema.index({ contractor: 1 });

module.exports = mongoose.model('Update', updateSchema);
