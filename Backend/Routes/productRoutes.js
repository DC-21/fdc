const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByUserId,
} = require("../Services/productServices");

const router = express.Router();

// Route to create a new product
router.post("/new-product", createProduct);

// Route to fetch all products
router.get("/", getAllProducts);

// Route to fetch a product by its ID
router.get("/:id", getProductById);

// Route to fetch products by user ID
router.get("/user/:userId", getProductsByUserId);

module.exports = router;
