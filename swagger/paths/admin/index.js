const getusers = require("./getusers");
const changeUserStatus = require("./changeUseraccountStatus");
const getKYCdetails = require("./getKYCdetails");
const changeKYCstatus = require("./changeKYCstatus");

module.exports = {
  "/admin/getallusers": { ...getusers },
  "/admin/changeUserStatus": { ...changeUserStatus },
  "/admin/getKYCdetails": { ...getKYCdetails },
  "/admin/changeKYCstatus": { ...changeKYCstatus },
};
