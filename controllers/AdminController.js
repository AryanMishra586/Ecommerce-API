/**
 * AdminController Files has function related to admin operations
 * Get list of all users
 * Create first admin (bootstrap)
 * Make user admin
 * Approve/Reject user roles
 */
const { verifyTokenAndAuth, verifyToken } = require("../middlewares/verifyToken");

const CryptoJS = require("crypto-js");
const router = require("express").Router()

const User = require("../models/User");
const VLC = require("../models/VLC");
const Seller = require("../models/Seller");
const Wholeseller = require("../models/Wholeseller");
const Retailer = require("../models/Retailer");
const Implement = require("../models/Implement");
const LabourProvider = require("../models/LabourProvider");


/**
 * BOOTSTRAP: Create the first admin using a secret key.
 * This should only be used ONCE to create the initial admin.
 * @param {Object} req.body - Contains secretKey and userId
 * @param {string} req.body.secretKey - Must match ADMIN_SECRET_KEY in .env
 * @param {string} req.body.userId - The user ID to make admin
 * @returns {Object} Success or error message
 */
exports.createFirstAdmin = async (req, res, next) => {
    try {
        const { secretKey, userId } = req.body;
        
        // Verify the secret key from environment
        if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ 
                "response": "403", 
                "message": "Invalid or missing secret key" 
            });
        }
        
        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ isSuperAdmin: true });
        if (existingSuperAdmin) {
            return res.status(400).json({ 
                "response": "400", 
                "message": "A super admin already exists. Only super admin can add new admins." 
            });
        }
        
        // Find and update the user to be super admin
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { isAdmin: true, isSuperAdmin: true } },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ 
                "response": "404", 
                "message": "User not found" 
            });
        }
        
        return res.status(200).json({ 
            "response": "200", 
            "message": "Super admin created successfully",
            "user": { id: user._id, name: user.name, mobile: user.mobile, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
    }
};


/**
 * Make a user an admin (only super admin can do this).
 * @param {string} req.body.userId - The user ID to make admin
 * @returns {Object} Success or error message
 */
exports.makeAdmin = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            // Only super admin can make other users admins
            if (!currentUser || !currentUser.isSuperAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only super admin can make other users admins" 
                });
            }
            
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "userId is required" 
                });
            }
            
            // Prevent self-modification
            if (userId === req.user.id) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "You cannot modify your own admin status" 
                });
            }
            
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { isAdmin: true } },
                { new: true }
            );
            
            if (!user) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User not found" 
                });
            }
            
            return res.status(200).json({ 
                "response": "200", 
                "message": "User is now an admin",
                "user": { id: user._id, name: user.name, mobile: user.mobile, isAdmin: user.isAdmin }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Remove admin status from a user (only super admin can do this).
 * @param {string} req.body.userId - The user ID to remove admin status
 * @returns {Object} Success or error message
 */
exports.removeAdmin = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            // Only super admin can remove admin status
            if (!currentUser || !currentUser.isSuperAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only super admin can remove admin status" 
                });
            }
            
            const { userId } = req.body;
            
            // Prevent self-modification
            if (userId === req.user.id) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "You cannot remove your own admin status" 
                });
            }
            
            // Check if target user is super admin (cannot be removed)
            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User not found" 
                });
            }
            
            if (targetUser.isSuperAdmin) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "Cannot remove super admin status. Super admin is permanent." 
                });
            }
            
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { isAdmin: false } },
                { new: true }
            );
            
            return res.status(200).json({ 
                "response": "200", 
                "message": "Admin status removed",
                "user": { id: user._id, name: user.name, mobile: user.mobile, isAdmin: user.isAdmin }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Get all pending role requests (admin only).
 * @returns {Object} List of users with pending roles
 */
exports.getPendingRoles = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            if (!currentUser || !currentUser.isAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Unauthorized access" 
                });
            }
            
            // Find users with pending roles
            const usersWithPendingRoles = await User.find({
                "userrole.status": "pending"
            }).select('_id name mobile userrole');
            
            // Filter to only show pending roles
            const pendingRequests = usersWithPendingRoles.map(user => ({
                userId: user._id,
                name: user.name,
                mobile: user.mobile,
                pendingRoles: user.userrole.filter(r => r.status === 'pending')
            }));
            
            return res.status(200).json({ 
                "response": "200", 
                "pendingRequests": pendingRequests 
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Approve a user's role request (admin only).
 * @param {string} req.body.userId - The user ID
 * @param {string} req.body.role - The role to approve
 * @returns {Object} Success or error message
 */
exports.approveRole = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            if (!currentUser || !currentUser.isAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only admins can approve roles" 
                });
            }
            
            const { userId, role } = req.body;
            
            if (!userId || !role) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "userId and role are required" 
                });
            }
            
            // Update role status in User document
            const user = await User.findOneAndUpdate(
                { _id: userId, "userrole.role": role },
                { $set: { "userrole.$.status": "approved" } },
                { new: true }
            );
            
            if (!user) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User or role not found" 
                });
            }
            
            // Update corresponding role document status
            const roleModelMap = {
                'vlc': VLC,
                'seller': Seller,
                'wholeseller': Wholeseller,
                'retailer': Retailer,
                'implement': Implement,
                'labourprovider': LabourProvider
            };
            
            const RoleModel = roleModelMap[role];
            if (RoleModel) {
                await RoleModel.findOneAndUpdate(
                    { userId: userId },
                    { $set: { status: "approved" } }
                );
            }
            
            return res.status(200).json({ 
                "response": "200", 
                "message": `Role '${role}' approved for user`,
                "user": { id: user._id, name: user.name, userrole: user.userrole }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Reject a user's role request (admin only).
 * @param {string} req.body.userId - The user ID
 * @param {string} req.body.role - The role to reject
 * @returns {Object} Success or error message
 */
exports.rejectRole = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            if (!currentUser || !currentUser.isAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only admins can reject roles" 
                });
            }
            
            const { userId, role } = req.body;
            
            if (!userId || !role) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "userId and role are required" 
                });
            }
            
            // Update role status in User document
            const user = await User.findOneAndUpdate(
                { _id: userId, "userrole.role": role },
                { $set: { "userrole.$.status": "rejected" } },
                { new: true }
            );
            
            if (!user) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User or role not found" 
                });
            }
            
            // Update corresponding role document status
            const roleModelMap = {
                'vlc': VLC,
                'seller': Seller,
                'wholeseller': Wholeseller,
                'retailer': Retailer,
                'implement': Implement,
                'labourprovider': LabourProvider
            };
            
            const RoleModel = roleModelMap[role];
            if (RoleModel) {
                await RoleModel.findOneAndUpdate(
                    { userId: userId },
                    { $set: { status: "rejected" } }
                );
            }
            
            return res.status(200).json({ 
                "response": "200", 
                "message": `Role '${role}' rejected for user`,
                "user": { id: user._id, name: user.name, userrole: user.userrole }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Approve ALL pending roles for a user at once (admin only).
 * @param {string} req.body.userId - The user ID
 * @returns {Object} Success or error message
 */
exports.approveAllRoles = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            if (!currentUser || !currentUser.isAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only admins can approve roles" 
                });
            }
            
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "userId is required" 
                });
            }
            
            // Find user and get all pending roles
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User not found" 
                });
            }
            
            const pendingRoles = user.userrole.filter(r => r.status === 'pending');
            
            if (pendingRoles.length === 0) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "No pending roles to approve" 
                });
            }
            
            // Update all pending roles to approved in User document
            await User.updateOne(
                { _id: userId },
                { $set: { "userrole.$[elem].status": "approved" } },
                { arrayFilters: [{ "elem.status": "pending" }] }
            );
            
            // Update corresponding role documents
            const roleModelMap = {
                'vlc': VLC,
                'seller': Seller,
                'wholeseller': Wholeseller,
                'retailer': Retailer,
                'implement': Implement,
                'labourprovider': LabourProvider
            };
            
            const approvedRoleNames = [];
            for (const pendingRole of pendingRoles) {
                const RoleModel = roleModelMap[pendingRole.role];
                if (RoleModel) {
                    await RoleModel.findOneAndUpdate(
                        { userId: userId },
                        { $set: { status: "approved" } }
                    );
                    approvedRoleNames.push(pendingRole.role);
                }
            }
            
            const updatedUser = await User.findById(userId);
            
            return res.status(200).json({ 
                "response": "200", 
                "message": `Approved ${approvedRoleNames.length} role(s): ${approvedRoleNames.join(', ')}`,
                "user": { id: updatedUser._id, name: updatedUser.name, userrole: updatedUser.userrole }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Reject ALL pending roles for a user at once (admin only).
 * @param {string} req.body.userId - The user ID
 * @returns {Object} Success or error message
 */
exports.rejectAllRoles = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            
            if (!currentUser || !currentUser.isAdmin) {
                return res.status(403).json({ 
                    "response": "403", 
                    "message": "Only admins can reject roles" 
                });
            }
            
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "userId is required" 
                });
            }
            
            // Find user and get all pending roles
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    "response": "404", 
                    "message": "User not found" 
                });
            }
            
            const pendingRoles = user.userrole.filter(r => r.status === 'pending');
            
            if (pendingRoles.length === 0) {
                return res.status(400).json({ 
                    "response": "400", 
                    "message": "No pending roles to reject" 
                });
            }
            
            // Update all pending roles to rejected in User document
            await User.updateOne(
                { _id: userId },
                { $set: { "userrole.$[elem].status": "rejected" } },
                { arrayFilters: [{ "elem.status": "pending" }] }
            );
            
            // Update corresponding role documents
            const roleModelMap = {
                'vlc': VLC,
                'seller': Seller,
                'wholeseller': Wholeseller,
                'retailer': Retailer,
                'implement': Implement,
                'labourprovider': LabourProvider
            };
            
            const rejectedRoleNames = [];
            for (const pendingRole of pendingRoles) {
                const RoleModel = roleModelMap[pendingRole.role];
                if (RoleModel) {
                    await RoleModel.findOneAndUpdate(
                        { userId: userId },
                        { $set: { status: "rejected" } }
                    );
                    rejectedRoleNames.push(pendingRole.role);
                }
            }
            
            const updatedUser = await User.findById(userId);
            
            return res.status(200).json({ 
                "response": "200", 
                "message": `Rejected ${rejectedRoleNames.length} role(s): ${rejectedRoleNames.join(', ')}`,
                "user": { id: updatedUser._id, name: updatedUser.name, userrole: updatedUser.userrole }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};


/**
 * Get list of all users (admin only).
 * @returns {Object} The response containing all users or error message.
 */
exports.getAllUsers = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
        
            if (!currentUser) {
                return res.status(404).json({ "response": "404", "message": "User not found" });
            }
        
            if (!currentUser.isAdmin) {
                return res.status(403).json({ "response": "403", "message": "Unauthorized access" });
            }
        
            const users = await User.find();
            return res.status(200).json({ "response": "200", users });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500", "message": "Internal Server Error" });
        }
    });
};