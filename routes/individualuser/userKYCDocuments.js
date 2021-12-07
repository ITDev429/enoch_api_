const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const auth = require("../../middleware/auth");

const { isImage } = require("../../utils");

const userKYCDocumentsController = require("../../controllers/individualuser/userKYCdocumentsController");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let path = "./public/uploads/" + req.user.id + "/KYCdocuments/";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, " ") + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!isImage(file.mimetype)) {
      cb(new Error("only upload files with jpg or jpeg format."));
    }
    cb(undefined, true);
  },
});
router.post(
  "/uploadKYCdocuments",
  auth,
  upload.any(), //upload array or single
  userKYCDocumentsController.postUserKYCdocuments
);
module.exports = router;
