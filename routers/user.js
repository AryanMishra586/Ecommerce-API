
/**
 * Express Router for handling user-related routes.
 */
const { changeName, changeProfilePic, deleteUser, userRoles, getUserProfile } = require("../controllers/UserController");

const router = require("express").Router()




router.put("/name/:id", changeName);

router.post("/profilepic/:id", changeProfilePic);

router.delete("/:id", deleteUser)

router.post("/userroles", userRoles)

router.get("/getUserProfile", getUserProfile);
  



module.exports = router;