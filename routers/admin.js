const { 
    getAllUsers, 
    createFirstAdmin, 
    makeAdmin, 
    removeAdmin,
    getPendingRoles,
    approveRole,
    rejectRole,
    approveAllRoles,
    rejectAllRoles
} = require("../controllers/AdminController");
const router = require("express").Router()


// Bootstrap - Create first admin (requires secret key, no auth)
router.post("/bootstrap", createFirstAdmin);

// Admin management (requires super admin auth)
router.post("/makeAdmin", makeAdmin);
router.post("/removeAdmin", removeAdmin);

// Role management - Individual (requires admin auth)
router.get("/pendingRoles", getPendingRoles);
router.post("/approveRole", approveRole);
router.post("/rejectRole", rejectRole);

// Role management - Bulk (requires admin auth)
router.post("/approveAllRoles", approveAllRoles);
router.post("/rejectAllRoles", rejectAllRoles);

// User management (requires admin auth)
router.get("/getAllUsers", getAllUsers);


module.exports = router