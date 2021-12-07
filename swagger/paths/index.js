const adminpaths = require("./admin/index");
const individualuserpaths = require("./individualuser/index");
const individualuserBusinessInfo = require("./individualuser/businessInfoPaths/index");
const walletPaths = require("./individualuser/walletpaths/index");

module.exports = {
  paths: {
    //admin Routes Definitions
    ...adminpaths,
    //individualuser Routes Definitions
    ...individualuserpaths,
    // individualuserBusinessInfo Routes Definitions
    ...individualuserBusinessInfo,
    // individualuserwallet Paths
    ...walletPaths,
  },
};
