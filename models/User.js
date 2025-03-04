const mongoose = require("mongoose")




//Address Schema
const addressSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    mobile: {type: String, required: true},
    addressLine: {type: String, required: true},
    state: {type: String, required: true},
    district: {type: String, required: true},
    block: {type: String, required: true},
    village: {type: String, required: true},
    pincode: {type: String, required: true}
})

const userRoles = new mongoose.Schema({
    role: {type: String, required: true}
})


//User Schema
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, default: "null"},
        mobile: {type: String, required: true, unique: true},
        profilepic: {type: String, default: "null"}, //base64
        userrole: [userRoles],
        address: {type: String},
        state: {type: String},
        district: {type: String},
        block: {type: String},
        village: {type: String},
        pincode: {type: String},
        addresses: [addressSchema],
        isApproved: {type: Boolean, default: false},
        isAdmin: { type: Boolean, default: false},
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);