const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  otp: { type: DataTypes.STRING, allowNull: true },
  termsAccepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  privacyAccepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  creditConsent: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
