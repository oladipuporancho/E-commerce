const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage }).fields([
  { name: "idDocument", maxCount: 1 },
  { name: "selfie", maxCount: 1 },
  { name: "utilityBill", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
]);

module.exports = upload;
