const { verifyTokenAndAuth, verifyToken } = require("../middlewares/verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router()

const User = require("../models/User");



/**
 * Adding address of user in addresses array.
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} req.body - The request body object containing the address info.
 * Finding user by id and then pushing address in addresses array.
 * @returns {Object} The response containing the success message or error message.
 */
exports.addAddress = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try{
            const address = {
                id: (req.user.addresses.length + 1).toString(),
                name: req.body.name,
                mobile: req.body.mobile,
                addressLine: req.body.addressLine,
                state: req.body.state,
                district: req.body.district,
                block: req.body.block,
                village: req.body.village,
                pincode: req.body.pincode
            }
            try{
                const updateUser = await User.findByIdAndUpdate(req.user.id, {$push: {addresses: address}}, {new:true})
                return res.status(200).json({"response": "200","message": "Address Updated Sucessfully"})
            }catch(err){
                console.log(err)
                return res.status(500).json({"response": "500","message": "Internal Server Error"})
            }
        }catch(err){
            res.status(500).json({"error": err})
        }
    })
}



/**
 * Updating address of user by specific address id.
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} req.body - The request body object containing the address info.
 * Finding user by id and then find address by id then update that address.
 * @returns {Object} The response containing the success message or error message.
 */
exports.updateAddress = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const addressId = req.params.id;
            const {
              name,
              mobile,
              addressLine,
              state,
              district,
              block,
              village,
              pincode
            } = req.body;
        
            const updatedAddress = {
              id: addressId,
              name,
              mobile,
              addressLine,
              state,
              district,
              block,
              village,
              pincode
            };
        
            try {
              const user = await User.findOneAndUpdate(
                { _id: req.user.id, "addresses.id": addressId },
                { $set: { "addresses.$": updatedAddress } },
                { new: true }
              );
        
              if (!user) {
                return res.status(404).json({ "response": "404","message": "Address not found" });
              }
        
              return res.status(200).json({ "response": "200","message": "Address updated successfully" });
            } catch (err) {
              console.log(err);
              return res.status(500).json({ "response": "500","message": "Internal Server Error" });
            }
          } catch (err) {
            res.status(500).json({ error: err });
          }
    })
}


/**
 * Deleting address by specific id.
 * @param {string} req.params.id - The ID of the user.
 * Finding user by id and then find address by id then delete that address.
 * @returns {Object} The response containing the success message or error message.
 */
exports.deleteAddress = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const addressId = req.params.id;
        
            try {
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $pull: { addresses: { id: addressId } } },
                { new: true }
            );
        
            if (!user) {
                return res.status(404).json({"response": "404", "message": "User not found" });
            }
        
            return res.status(200).json({ "response": "200","message": "Address deleted successfully" });
            } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500","message": "Internal Server Error" });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    })
}


/**
 * Get all address of user.
 * @param {string} req.params.id - The ID of the user.
 * Finding user by id and then get all addresses of user.
 * @returns {Object} The response containing addresses or error message.
 */
exports.getAllAddresses = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const user = await User.findById(req.user.id);
        
            if (!user) {
              return res.status(404).json({ "response": "404","message": "User not found" });
            }
        
            const addresses = user.addresses;
            return res.status(200).json({"response": "200", addresses});
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500","message": "Internal Server Error" });
          }
    })
}


/**
 * Get all address of user by specific id of address.
 * @param {string} req.params.id - The ID of the user.
 * Finding user by id and then get address by address id.
 * @returns {Object} The response containing address or error message.
 */
exports.getAddressbyId = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const addressId = req.params.id;
            const user = await User.findById(req.user.id);
        
            if (!user) {
              return res.status(404).json({ "response": "404","message": "User not found" });
            }
        
            const address = user.addresses.find((addr) => addr.id === addressId);
            if (!address) {
              return res.status(404).json({ "response": "404","message": "Address not found" });
            }
        
            return res.status(200).json({ "response": "200" , address} );
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500","message": "Internal Server Error" });
          }
    })
}