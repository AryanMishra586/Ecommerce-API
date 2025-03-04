const { getAllUsers } = require("../controllers/AdminController");
const router = require("express").Router()




router.get("/getAllUsers", getAllUsers);
  



  module.exports = router