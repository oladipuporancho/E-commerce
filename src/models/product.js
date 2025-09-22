const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path if needed

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  specs: {
    type: DataTypes.JSONB, // PostgreSQL JSON column
    allowNull: true,
  },
});

module.exports = Product;
