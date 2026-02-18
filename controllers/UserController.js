/**
 * UserController Files has function related to user profile operations
 * Change name of user
 * change profile picture of user
 * Delete User
 * Assign User Roles 
 * Get User profile Data
 */
const User = require("../models/User");
const VLC = require("../models/VLC");
const Wholeseller = require("../models/Wholeseller");
const Seller = require("../models/Seller");
const Retailer = require("../models/Retailer");
const LabourProvider = require("../models/LabourProvider");
const Implement = require("../models/Implement");

const { verifyTokenAndAuth, verifyToken } = require("../middlewares/verifyToken");
const { use } = require("../routers/user");



/**
 * Update the name of a user.
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} req.body - The request body object containing the updated name.
 * Finding user by id and then update name by object provided in request body.
 * @returns {Object} The response containing the updated user or error message.
 */

exports.changeName = async (req, res, next)=>{
    verifyTokenAndAuth(req,res, async()=>{
        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
            return res.status(200).json({"response": "200"}, updateUser)
        }catch(err){
            return res.status(500).json({"response": "500"},err)
        }
    })
}

/**
 * Update the profile picture of a user in base64 string format.
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} req.body - The request body object containing the updated profile picture.
 * Finding user by id and then updating profile picture by object provided in request body.
 * @returns {Object} The response containing the updated user.
 */
exports.changeProfilePic = async (req, res, next)=>{
    verifyTokenAndAuth(req,res, async()=>{
        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
            res.status(200).json({"response": "200", "message": "Updated Sucessfully"})
        }catch(err){
            res.status(500).json({"response": "500", "error": "Internal Server Error"})
        }
    })
}

/**
 * Delete a user by their ID.
 * @param {string} req.params.id - The ID of the user to delete.
 * Finding user by id and deleting user information.
 * @returns {Object} The response indicating the success or failure of the deletion operation.
 */
exports.deleteUser = async (req, res, next)=>{
    verifyTokenAndAuth(req,res, async()=>{
        try{
            const updateUser = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({"response": "200","message":"User Deleted Sucessfully"})
        }catch(err){
            res.status(500).json({"response": "500"},err)
        }
    })
}


/**
* Request a role for the user (starts as pending, requires admin approval)
* @param {Object} req.body - The request body object containing role to request.
* @param {string} req.body.role - One of: vlc, seller, wholeseller, retailer, labourprovider, implement
* @returns {Object} The response containing success message or error.
*/
exports.userRoles = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try{
            const requestedRole = req.body.role;
            
            // Validate role is one of the allowed values
            const allowedRoles = ['vlc', 'seller', 'wholeseller', 'retailer', 'labourprovider', 'implement'];
            if (!allowedRoles.includes(requestedRole)) {
                return res.status(400).json({
                    "response": "400",
                    "error": `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
                });
            }
            
            // Check if user already has this role (any status)
            const user = await User.findById(req.user.id);
            const existingRole = user.userrole.find(r => r.role === requestedRole);
            if (existingRole) {
                return res.status(400).json({
                    "response": "400",
                    "error": `You already have requested the '${requestedRole}' role. Status: ${existingRole.status}`
                });
            }
            
            // Add role with pending status
            const role = {
                role: requestedRole,
                status: 'pending'
            };
            
            const updateUser = await User.findByIdAndUpdate(
                req.user.id, 
                {$push: {userrole: role}}, 
                {new: true}
            );
            
            // Create the corresponding role document with pending status
            if(requestedRole == "vlc"){
                const vlc = new VLC({ userId: req.user.id, status: 'pending' });
                await vlc.save();
            }else if(requestedRole == "seller"){
                const seller = new Seller({ userId: req.user.id, status: 'pending' });
                await seller.save();
            }else if(requestedRole == "wholeseller"){
                const wholeseller = new Wholeseller({ userId: req.user.id, status: 'pending' });
                await wholeseller.save();
            }else if(requestedRole == "retailer"){
                const retailer = new Retailer({ userId: req.user.id, status: 'pending' });
                await retailer.save();
            }else if(requestedRole == "implement"){
                const implement = new Implement({ userId: req.user.id, status: 'pending' });
                await implement.save();
            }else if(requestedRole == "labourprovider"){
                const labourprovider = new LabourProvider({ userId: req.user.id, status: 'pending' });
                await labourprovider.save();
            }
            
            res.status(200).json({
                "response": "200", 
                "message": `Role '${requestedRole}' requested successfully. Awaiting admin approval.`,
                "user": updateUser
            });
        }catch(err){
            console.log(err);
            res.status(500).json({"response": "500","error": "Internal Server Error"});
        }
    })
}


/**
* Add role to user 
* @param {string} req.params.id - The ID of the user.
* Finding user by id.
* @returns {Object} The response containing the user information.
*/
exports.getUserProfile = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            const name = user.name;
            const profilepic = user.profilepic;
            const mobile = user.mobile;
            
            console.log(user)
            if (!user) {
              return res.status(404).json({ "response": "404","message": "User not found" });
            }
        
            return res.status(405).json({ "response": "200", user});
          } catch (err) {
            console.log(err);
            return res.status(500).json({ "response": "500","message": "Internal Server Error" });
          }
    })
}