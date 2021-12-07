const registerindividualuser = require("./register_user");
const verifyIndividualUserEmail = require("./verifyUserEmail");
const signInIndividualUser = require("./signIn");
const sendVerificationCodeIndividualUser = require("./sendVerificationCode");
const verifyPhoneNumberIndividualUser = require("./verifyPhoneNumber");
const verifyRecoveryappTwoFA = require("./recoveryNumber");
const getQRappTwoFA = require("./appQr");
const verifyappTwoFA = require("./verifyAppTwoFA");
const verifSignInIndividualUser = require("./verifysignin");
const changeNumberIndividualUser = require("./changeNubmerRequest");
const verifychangeNumberRequestIndividualUser = require("./verifychangeNumberRequest");
const postNewNumberIndividualUser = require("./postNewNumber");
const passwordRecoveryMailIndividualUser = require("./recoveryPasswordMail");
const changepasswordIndividualUser = require("./changePassword");
const getTwoFATypeIndividualUser = require("./getTwoFAType");
const verifychangePasswordAppTwoFAIndividualUser = require("./verifyChangePasswordByAppTwoFA");
const getchangePasswordCodeMobileTwoFAIndividualUser = require("./getRecoveryPasswordMobileCode");

module.exports = {
  "/register": { ...registerindividualuser },
  "/verifyusermail": { ...verifyIndividualUserEmail },
  "/signIn": { ...signInIndividualUser },
  "/sendverificationCode": {
    ...sendVerificationCodeIndividualUser,
  },
  "/verifyPhoneNumber": { ...verifyPhoneNumberIndividualUser },
  "/verifyrecoveryphone": { ...verifyRecoveryappTwoFA },
  "/verifyapptwoFA": { ...verifyappTwoFA },
  "/verifysignin": { ...verifSignInIndividualUser },
  "/verifychangeNumberRequest": {
    ...verifychangeNumberRequestIndividualUser,
  },
  "/postnewnumber": { ...postNewNumberIndividualUser },
  "/changePassword": {
    ...changepasswordIndividualUser,
  },
  "/verifyrecoveryPasswordApp": {
    ...verifychangePasswordAppTwoFAIndividualUser,
  },
  "/changeNumber/{email}": { ...changeNumberIndividualUser },
  "/getTwoFAType/{email}": {
    ...getTwoFATypeIndividualUser,
  },
  "/getappverificationQr/{email}": { ...getQRappTwoFA },
  "/getrecoveryPasswordToken/{email}": {
    ...passwordRecoveryMailIndividualUser,
  },
  "/sendcodeMobileTwoFA/{email}/{phonenumber}": {
    ...getchangePasswordCodeMobileTwoFAIndividualUser,
  },
};
