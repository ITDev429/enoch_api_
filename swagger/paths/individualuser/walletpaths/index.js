const getwalletSign = require("./getWalletSign");
const linkwalletKYC = require("./linkwalletKYC");

module.exports = {
  "/getwalletSign": {
    ...getwalletSign,
  },
  "/linkUserwallet": {
    ...linkwalletKYC,
  },
};
