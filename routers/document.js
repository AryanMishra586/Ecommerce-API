/**
 * Express router for handling Aadhaar related routes.
 * @module routes/aadhaarRoutes
 */

const { certificate, bankDetails, aadhar } = require("../controllers/DocumentController");
const router = require("express").Router()




router.post("/aadhar", aadhar);

router.post("/bankdetail", bankDetails);

router.post("/certificate", certificate);

module.exports = router;
