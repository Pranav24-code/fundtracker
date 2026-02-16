const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
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
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        match: [/^[1-9][0-9]{5}$/, 'Invalid pincode'],
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
      },
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    amountSpent: {
      type: Number,
      default: 0,
      min: [0, 'Amount spent cannot be negative'],
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Completion cannot be negative'],
      max: [100, 'Completion cannot exceed 100%'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    expectedEndDate: {
      type: Date,
      required: [true, 'Expected end date is required'],
    },
    actualEndDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['On Time', 'Delayed', 'Critical', 'Completed'],
      default: 'On Time',
    },
    riskFlag: {
      type: Boolean,
      default: false,
    },
    riskFactors: [
      {
        type: String,
        enum: [
          'BUDGET_OVERRUN',
          'TIMELINE_DELAY',
          'BUDGET_SPIKE',
          'GPS_FRAUD',
          'PUBLIC_CONCERN',
        ],
      },
    ],
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    budgetHistory: [
      {
        amount: Number,
        reason: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for delay calculation
projectSchema.virtual('delayDays').get(function () {
  if (this.status === 'Completed') return 0;

  const today = new Date();
  const expectedEnd = new Date(this.expectedEndDate);

  if (today > expectedEnd) {
    const diffTime = Math.abs(today - expectedEnd);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return 0;
});

// Virtual for spending percentage
projectSchema.virtual('spendingPercentage').get(function () {
  if (!this.totalBudget || this.totalBudget === 0) return '0.00';
  return ((this.amountSpent / this.totalBudget) * 100).toFixed(2);
});

// Index for geospatial queries
projectSchema.index({ 'location.coordinates': '2dsphere' });
// Index for common queries
projectSchema.index({ department: 1, status: 1 });
projectSchema.index({ isActive: 1 });

module.exports = mongoose.model('Project', projectSchema);
