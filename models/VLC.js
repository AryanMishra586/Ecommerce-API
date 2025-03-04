const mongoose = require("mongoose")



//VLC Schema
const vlcSchema = new mongoose.Schema(
    {
        aadhar: {type: String},
        bank: {type: String},
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

module.exports = mongoose.model("VLC", vlcSchema);