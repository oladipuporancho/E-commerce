const Product = require("../models/product");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const product = await Product.create({
      name,
      category,
      price,
      description,
      imageUrl: req.file ? `uploads/${req.file.filename}` : null,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({ where: { category } });

    if (!products.length) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
