const adminroutes = require("./Admin/adminRoutes");
const individualUserroutes = require("./individualuser/individualUserRoutes");
const businessProfileroutes = require("./individualuser/businessProfileRoutes");
const linkUserWalletroutes = require("./individualuser/linkWalletKYC");
const userKYCDocuments = require("./individualuser/userKYCDocuments");

module.exports = [].concat(
  adminroutes,
  individualUserroutes,
  businessProfileroutes,
  linkUserWalletroutes,
  userKYCDocuments
);
