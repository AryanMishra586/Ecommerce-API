const mongoose = require("mongoose")



//Wholeseller Schema
const wholesellerSchema = new mongoose.Schema(
    {
        aadhar: {type: String},
        bank: {type: String},
        gst: {type: String},
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

module.exports = mongoose.model("Wholeseller", wholesellerSchema);