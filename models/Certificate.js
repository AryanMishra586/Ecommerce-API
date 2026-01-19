const mongoose = require("mongoose")



/**
 * Certificate Schema for storing certificate information.
 */
const certificateSchema = new mongoose.Schema(
    {
        certificateNo: {type: String, required: true},
        certificate: {type: String, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'approved', 'rejected'],
          },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Certificate", certificateSchema);