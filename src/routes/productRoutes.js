const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Product routes
router.post("/product", productController.createProduct);
router.get("/product", productController.getProducts);
router.get("/product/:id", productController.getProductById);

// Category routes (updated to use /product/category/:category)
router.get("/product/category/:category", productController.getProductsByCategory);
router.get("/categories", productController.getAllCategories);

module.exports = router;
