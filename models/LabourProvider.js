const mongoose = require("mongoose")



//LabourProvider Schema
const labourProviderSchema = new mongoose.Schema(
    {
        aadhar: {type: String},
        bank: {type: String},
        certificate: {type: String},
        userId: {type: String, required: true, unique: true},
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'approved', 'rejected'],
          },
    },
    {timestamps: true}
);

module.exports = mongoose.model("LabourProvider", labourProviderSchema);