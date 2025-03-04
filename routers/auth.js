const router = require("express").Router()
const { verifyOtp, sendOtp } = require("../controllers/AuthController")





router.post("/sendotp", sendOtp)


router.post("/verifyotp", verifyOtp)




module.exports = router