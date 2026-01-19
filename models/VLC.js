const mongoose = require("mongoose")



//VLC Schema
const vlcSchema = new mongoose.Schema(
    {
        aadhar: {type: mongoose.Schema.Types.ObjectId, ref: 'Aadhar'},
        bank: {type: mongoose.Schema.Types.ObjectId, ref: 'BankDetails'},
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

module.exports = mongoose.model("VLC", vlcSchema);