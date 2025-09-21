const Kyc = require("../models/kyc");
const path = require("path");

exports.submitBasicInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, address, dob, bvn } = req.body;

    let kyc = await Kyc.findOne({ where: { userId } });
    if (!kyc) {
      kyc = await Kyc.create({ userId, fullName, address, dob, bvn });
    } else {
      kyc.fullName = fullName;
      kyc.address = address;
      kyc.dob = dob;
      kyc.bvn = bvn;
      await kyc.save();
    }

    res.json({ message: "Basic info updated successfully", user: kyc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update basic info" });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    const kyc = await Kyc.findOne({ where: { userId } });
    if (!kyc) return res.status(404).json({ message: "KYC record not found" });

   
    kyc.idDocumentUrl = files.idDocument ? path.join("uploads", files.idDocument[0].filename) : kyc.idDocumentUrl;
    kyc.selfieUrl = files.selfie ? path.join("uploads", files.selfie[0].filename) : kyc.selfieUrl;
    kyc.utilityBillUrl = files.utilityBill ? path.join("uploads", files.utilityBill[0].filename) : kyc.utilityBillUrl;
    kyc.bankStatementUrl = files.bankStatement ? path.join("uploads", files.bankStatement[0].filename) : kyc.bankStatementUrl;

    await kyc.save();

    res.json({
      message: "Documents uploaded successfully",
      files: {
        idDocumentUrl: kyc.idDocumentUrl,
        selfieUrl: kyc.selfieUrl,
        utilityBillUrl: kyc.utilityBillUrl,
        bankStatementUrl: kyc.bankStatementUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload documents" });
  }
};

// Update bank info
exports.updateBankInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bankAccountNumber, bankName } = req.body;

    const kyc = await Kyc.findOne({ where: { userId } });
    if (!kyc) return res.status(404).json({ message: "KYC record not found" });

    kyc.bankAccountNumber = bankAccountNumber;
    kyc.bankName = bankName;

    await kyc.save();

    res.json({ message: "Bank details updated successfully", user: kyc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update bank info" });
  }
};
