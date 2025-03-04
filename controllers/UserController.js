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
* Add role to user 
* @param {string} req.params.id - The ID of the user.
* @param {Object} req.body - The request body object containing role to be add in userroles.
* Finding user by id and then push new role in userroles. Then also add this user to respective role document.
* @returns {Object} The response containing the updated user.
*/
exports.userRoles = async (req, res, next)=>{
    verifyToken(req,res, async()=>{
        try{
            const role = {
                role: req.body.role
            }
            const updateUser = await User.findByIdAndUpdate(req.user.id, {$push: {userrole: role}}, {new:true})
            if(req.body.role == "vlc"){
                const vlc = new VLC({
                    userId: req.user.id
                })
                await vlc.save()
            }else if(req.body.role == "seller"){
                const seller = new Seller({
                    userId: req.user.id
                })
                await seller.save()
            }else if(req.body.role == "wholeseller"){
                const wholeseller = new WholeSeller({
                    userId: req.user.id
                    })
                    await wholeseller.save()
            }else if(req.body.role == "retailer"){
                const retailer = new Retailer({
                    userId: req.user.id
                    })
                    await retailer.save()
            }else if(req.body.role == "implement"){
                const implement = new Implement({
                    userId: req.user.id
                    })
                    await implement.save()
            }else if(req.body.role == "labourprovider"){
                const labourprovider = new LabourProvider({
                    userId: req.user.id
                    })
                    await labourprovider.save()
            }
            res.status(200).json({"response": "200", updateUser})
        }catch(err){
            res.status(500).json({"response": "500","error": "Internal Server Error"})
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