/**
 * DocumentController Files has function related to document store operations
 * Adding aadhar of user
 * Adding bank detail of user
 * Adding certificate details of labourprovider
 */
const { verifyTokenAndAuth, verifyToken } = require("../middlewares/verifyToken")
const CryptoJS = require("crypto-js");
const router = require("express").Router()


const User = require("../models/User");
const VLC = require("../models/VLC");
const Seller = require("../models/Seller");
const Wholeseller = require("../models/Wholeseller");
const Retailer = require("../models/Retailer");
const Implement = require("../models/Implement");
const LabourProvider = require("../models/LabourProvider");
const Aadhar = require("../models/Aadhar");
const BankDetails = require("../models/BankDetails");
const Certificate = require("../models/Certificate");



/**
 * Funtion saving Aadhar details ofc urrent user.
 * @param {Object} req.body - The request body object containing the aadhar details.
 * Saving Addhar detail and get id of that document.
 * Finding user roles and then storing aadhar document in that role document.
 * @returns {Object} The response containing aadhar uploaded or has any error.
 */
exports.aadhar = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            // Create a new Aadhaar
            const aadhaar = new Aadhar({
              aadharNo: req.body.aadharNo,
              aadharFront: req.body.aadharFront,
              aadharBack: req.body.aadharBack,
              userId: req.user.id,
              status: "pending",
            });
        
            // Save the Aadhaar
            await aadhaar.save();
        
            // Get the ID of the Aadhaar
            const id = aadhaar._id;
        
            const user = await User.findById(req.user.id);
        
            // Get the user roles
            const userRoles = await user.userrole;
        
            console.log(userRoles);
        
            // Iterate through the user roles
            for (const userRole of userRoles) {
              // Update the corresponding model based on the role
              if (userRole.role == "vlc") {
                const vlc = await VLC.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              } else if (userRole.role == "seller") {
                const seller = await Seller.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              } else if (userRole.role == "wholeseller") {
                const wholeseller = await Wholeseller.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              } else if (userRole.role == "retailer") {
                const retailer = await Retailer.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              } else if (req.body.role == "implement") {
                const implement = await Implement.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              } else if (userRole.role == "labourprovider") {
                const labourprovider = await LabourProvider.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { aadhar: id } },
                  { new: true }
                );
              }
            }
        
            // Return the Aadhaar
            res.status(200).json({ "response": "200", "message": "In review" });
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "error": "Internal Server Error" });
          }
    })
}

/**
 * Funtion saving bank details of current user.
 * @param {Object} req.body - The request body object containing the bank details.
 * Saving bank detail and get id of that document.
 * Finding user roles and then storing bankdetail document in that role document.
 * @returns {Object} The response containing bank detail stored or has any error.
 */
exports.bankDetails = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            // Create a new bank detail
            const bank = new BankDetails({
              bankAc: req.body.bankAc,
              bankIfsc: req.body.bankIfsc,
              bankName: req.body.bankName,
              AcHolderName: req.body.AcHolderName,
              AcPassbook: req.body.AcPassbook,
              userId: req.user.id,
              status: "pending",
            });
        
            // Save the bank detail
            await bank.save();
        
            // Get the ID of the bank detail
            const id = bank._id;
        
            const user = await User.findById(req.user.id);
        
            // Get the user roles
            const userRoles = await user.userrole;
        
            console.log(userRoles);
        
            // Iterate through the user roles
            for (const userRole of userRoles) {
              // Update the corresponding model based on the role
              if (userRole.role == "vlc") {
                const vlc = await VLC.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              } else if (userRole.role == "seller") {
                const seller = await Seller.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              } else if (userRole.role == "wholeseller") {
                const wholeseller = await Wholeseller.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              } else if (userRole.role == "retailer") {
                const retailer = await Retailer.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              } else if (req.body.role == "implement") {
                const implement = await Implement.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              } else if (userRole.role == "labourprovider") {
                const labourprovider = await LabourProvider.findOneAndUpdate(
                  { userId: req.user.id },
                  { $set: { bank: id } },
                  { new: true }
                );
              }
            }
        
            // Return the bank detail
            res.status(200).json({ "response": "200", "message": "In review" });
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "error": "Internal Server Error" });
          }
    })
}



/**
 * Funtion saving bank details of current user if current user has user role of labourprovider.
 * @param {Object} req.body - The request body object containing the certificate details.
 * Saving certificate detail and get id of that document.
 * Finding user roles and then storing certificatedetails document in that role document.
 * @returns {Object} The response containing certificate detail stored or has any error.
 */
exports.certificate = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const user = await User.findById(req.user.id);
        
            // Get the user roles
            const userRoles = await user.userrole;
        
            // Check if any of the user roles is "labourprovider"
            const isLabourProvider = userRoles.some(userRole => userRole.role === "labourprovider");
        
            if (isLabourProvider) {
              // Create a new certificate
              const certificate = new Certificate({
                certificateNo: req.body.certificateNo,
                certificate: req.body.certificate,
                userId: req.user.id,
                status: "pending",
              });
        
              // Save the certificate
              await certificate.save();
        
              // Get the ID of the certificate
              const id = certificate._id;
        
              const labourprovider = await LabourProvider.findOneAndUpdate(
                { userId: req.user.id },
                { $set: { certificate: id } },
                { new: true }
              );
        
              // Return the certificate
              res.status(200).json({ "response": "200", "message": "In review" });
            } else {
              res.status(401).json({ "response": "401", "message": "You don't have labourprovider userrole" });
            }
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "error": "Internal Server Error" });
          }
    })
}