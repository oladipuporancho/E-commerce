const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Kyc = sequelize.define("Kyc", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  dob: { type: DataTypes.DATE, allowNull: true },
  bvn: { type: DataTypes.STRING, allowNull: true },
  idNumber: { type: DataTypes.STRING, allowNull: true },
  idDocumentUrl: { type: DataTypes.STRING, allowNull: true },
  selfieUrl: { type: DataTypes.STRING, allowNull: true },
  utilityBillUrl: { type: DataTypes.STRING, allowNull: true },
  bankStatementUrl: { type: DataTypes.STRING, allowNull: true },
  bankAccountNumber: { type: DataTypes.STRING, allowNull: true },
  bankName: { type: DataTypes.STRING, allowNull: true },
  workEmail: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
});

module.exports = Kyc;
