const mongoose = require("mongoose")



//Wholeseller Schema
const wholesellerSchema = new mongoose.Schema(
    {
        aadhar: {type: mongoose.Schema.Types.ObjectId, ref: 'Aadhar'},
        bank: {type: mongoose.Schema.Types.ObjectId, ref: 'BankDetails'},
        gst: {type: mongoose.Schema.Types.ObjectId, ref: 'GST'},
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

module.exports = mongoose.model("Wholeseller", wholesellerSchema);