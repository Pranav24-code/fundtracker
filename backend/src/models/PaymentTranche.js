const mongoose = require('mongoose');

const paymentTrancheSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    trancheNumber: {
      type: Number,
      required: [true, 'Tranche number is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    releaseDate: {
      type: Date,
    },
    conditions: {
      type: String,
      maxlength: [500, 'Conditions cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'released', 'on_hold'],
      default: 'pending',
    },
    releasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

paymentTrancheSchema.index({ project: 1 });

module.exports = mongoose.model('PaymentTranche', paymentTrancheSchema);
