const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen reference is required'],
    },
    issueType: {
      type: String,
      required: [true, 'Issue type is required'],
      enum: [
        'Poor Quality',
        'Work Stopped',
        'Budget Misuse',
        'Timeline Delay',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    images: [
      {
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Resolved', 'Closed', 'Rejected'],
      default: 'Pending',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    adminResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
    trackingId: {
      type: String,
      unique: true,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      select: false, // Don't return by default for privacy
    },
  },
  {
    timestamps: true,
  }
);

// Generate tracking ID before saving
complaintSchema.pre('save', async function (next) {
  if (!this.trackingId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Complaint').countDocuments();
    this.trackingId = `CMP${year}${String(count + 1).padStart(6, '0')}`;
  }

  // Mark as critical if upvotes exceed threshold
  if (this.upvotes >= 100) {
    this.isCritical = true;
  }

  next();
});

// Indexes
complaintSchema.index({ project: 1 });
complaintSchema.index({ citizen: 1 });
complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
