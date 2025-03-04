/**
 * AdminController Files has function related to admin operations
 * Get list of all users
 */
const { verifyTokenAndAuth, verifyToken } = require("../middlewares/verifyToken");

const CryptoJS = require("crypto-js");
const router = require("express").Router()

const User = require("../models/User");



/**
 * Get list of all users.
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} req.body - The request body object containing the updated name.
 * Finding user by id and then update name by object provided in request body.
 * @returns {Object} The response containing the updated user or error message.
 */

exports.getAllUsers = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const currentUser = await User.findById(req.user.id);
        
            if (!currentUser) {
              return res.status(404).json({ "response": "404","message": "User not found" });
            }
        
            if (!currentUser.isAdmin) {
              return res.status(403).json({ "response": "403","message": "Unauthorized access" });
            }
        
            const users = await User.find();
            return res.status(200).json({ "response": "200", users});
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500","message": "Internal Server Error" });
          }
    })
}