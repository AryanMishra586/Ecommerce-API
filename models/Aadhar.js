const mongoose = require("mongoose");

/**
 * Aadhar Schema for storing Aadhar card information.
 */
const aadharSchema = new mongoose.Schema(
  {
    aadharNo: {
      type: String,
      required: true
    },
    aadharFront: {
      type: String,
      required: true
    },
    aadharBack: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'],
      },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Aadhar", aadharSchema);
