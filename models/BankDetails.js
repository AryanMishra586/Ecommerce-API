const mongoose = require("mongoose")



/**
 * BankDetails Schema for storing bank account information.
 */
const bankDetailsSchema = new mongoose.Schema(
    {
        bankAc: {type: String, required: true},
        bankIfsc: {type: String, required: true},
        bankName: {type: String, required: true},
        AcHolderName: {type: String, required: true},
        AcPassbook: {type: String, required: true},
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

module.exports = mongoose.model("BankDetails", bankDetailsSchema);