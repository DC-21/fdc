const admin = require("firebase-admin");
const db = admin.firestore();
const productCollection = db.collection("products");
const { v4: uuidv4 } = require("uuid");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      price,
      userId,
      image1,
      image2,
    } = req.body;

    if (!name || !description || !category || !quantity || !price || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productId = uuidv4();

    // Save product to Firestore
    await productCollection.add({
      id: productId,
      name,
      description,
      category,
      quantity,
      price,
      userId,
      image1,
      image2,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: "Product added successfully",
      productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const snapshot = await productCollection.get();
    const products = snapshot.docs.map((doc) => doc.data());

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Fetch product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productSnapshot = await productCollection.where("id", "==", id).get();

    if (productSnapshot.empty) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productSnapshot.docs[0].data();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product by ID" });
  }
};

// Fetch products by userId
const getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await productCollection
      .where("userId", "==", userId)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No products found for this user" });
    }

    const products = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by userId:", error);
    res.status(500).json({ message: "Error fetching products by userId" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByUserId,
};
