const User = require("./User");
const Kyc = require("./kyc");
const Otp = require("./otp");

// Associations
User.hasOne(Kyc, { foreignKey: "userId", as: "kyc" });
Kyc.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { User, Kyc, Otp };
