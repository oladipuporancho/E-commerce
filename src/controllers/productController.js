const Product = require("../models/product");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      image,
      rating,
      reviewCount,
      inStock,
      specs,
    } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      image,
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      inStock: inStock !== undefined ? inStock : true,
      specs: specs || null,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.findAll({ where: { category } });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const products = await Product.findAll({ attributes: ["category", "image"] });

    const categories = [];
    const seen = new Set();

    products.forEach((p) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        categories.push({
          id: p.category.toLowerCase(),
          name: p.category,
          image: p.image,
        });
      }
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
