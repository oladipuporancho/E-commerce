const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kycController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");


router.post(
  "/upload-documents",
  authMiddleware,
  upload,
  kycController.uploadDocuments
);

router.post("/basic-info", authMiddleware, kycController.submitBasicInfo);

router.post("/bank-info", authMiddleware, kycController.updateBankInfo);

module.exports = router;
