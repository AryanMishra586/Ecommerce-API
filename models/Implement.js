const mongoose = require("mongoose")



//Implement Schema
const implementSchema = new mongoose.Schema(
    {
        aadhar: {type: mongoose.Schema.Types.ObjectId, ref: 'Aadhar'},
        bank: {type: mongoose.Schema.Types.ObjectId, ref: 'BankDetails'},
        drivingLicense: {type: String},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'approved', 'rejected'],
          },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Implement", implementSchema);