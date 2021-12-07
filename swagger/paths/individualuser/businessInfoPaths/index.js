const individualProfile = require("./personalProfile");
const personalInfo = require("./personalInfo");
const accountInfo = require("./accountInfo");
const addressInfo = require("./addressInfo");
const KYCDocuments = require("./userKYCDocuments");

module.exports = {
  "/uplodphoto": { ...individualProfile },
  "/personalInfo": { ...personalInfo },
  "/accountInfo": { ...accountInfo },
  "/addressInfo": { ...addressInfo },
  "/uploadKYCdocuments": { ...KYCDocuments },
};
