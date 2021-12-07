const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/Admin/adminControllers");

router.get("/admin/getallusers", adminController.getUsersList);
router.put("/admin/changeUserStatus", adminController.updateUserAccountstatus);
router.get("/admin/getKYCdetails", adminController.getUserKYCdetails);
router.put("/admin/changeKYCstatus", adminController.putUserKYCstatus);

module.exports = router;
