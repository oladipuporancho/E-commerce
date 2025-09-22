const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Product routes
router.post("/products", productController.createProduct);         // Create
router.get("/products", productController.getProducts);            // Get all
router.get("/products/:id", productController.getProductById);     // Get one
router.delete("/products/:id", productController.deleteProduct);   // Delete

// Category routes
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/categories", productController.getAllCategories);

module.exports = router;
