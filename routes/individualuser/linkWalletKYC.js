const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const linkUserWallet = require("../../controllers/individualuser/linkUserWalletController");

router.get("/getwalletSign", auth, linkUserWallet.getWalletSign);
router.post("/linkUserwallet", auth, linkUserWallet.linkUserWallet);

module.exports = router;
