const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getUserCart);
router.delete("/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;
