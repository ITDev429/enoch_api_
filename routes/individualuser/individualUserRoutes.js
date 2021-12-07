const express = require("express");
const router = express.Router();
const authController = require("../../controllers/individualuser/individualUserControllers");

router.post("/register", authController.registerUser);
router.post("/verifyusermail", authController.verifyEmail);
router.post("/signIn", authController.signInIndividualUser);
router.post("/sendverificationCode", authController.sendVerificationCode);
router.post("/verifyPhoneNumber", authController.verifyPhoneNumber);

router.post("/verifyrecoveryphone", authController.verifyRecoveryNumber);
router.get("/getappverificationQr/:email", authController.getAppVerificationQR);
router.post("/verifyapptwoFA", authController.verifyAppTwoFA);
router.post("/verifysignin", authController.verifySignIn);
router.get("/changeNumber/:email", authController.requestchangeNumber);
router.post(
  "/verifychangeNumberRequest",
  authController.verifychangeNumberrequest
);
router.post("/postnewnumber", authController.addnewnumber);
router.get(
  "/getrecoveryPasswordToken/:email",
  authController.recoveryPasswordRequestByMail
);

router.put("/changePassword", authController.changePassword);

router.get("/getTwoFAType/:email", authController.getTwoFAType);
router.put(
  "/verifyrecoveryPasswordApp",
  authController.changePasswordByAppTwoFA
);
router.get(
  "/sendcodeMobileTwoFA/:email/:phonenumber",
  authController.sendVerificationCodeMobileTwoFA
);

module.exports = router;
