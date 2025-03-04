const { addAddress, updateAddress, deleteAddress, getAllAddresses, getAddressbyId } = require("../controllers/AddressController");
const router = require("express").Router()





router.put("/addAddress", addAddress)

router.put("/updateAddress/:id", updateAddress);

router.delete("/deleteAddress/:id", deleteAddress);

router.get("/getAddresses", getAllAddresses);

router.get("/getAddress/:id", getAddressbyId);
  
module.exports = router