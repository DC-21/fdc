const admin = require("firebase-admin");
const db = admin.firestore();
const productCollection = db.collection("products");

// Get all products
async function getAllProducts() {
  const productsSnapshot = await productCollection.get();
  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Create a new product
async function createProduct(data) {
  const newProductRef = await productCollection.add(data);
  const newProduct = await newProductRef.get();
  return { id: newProduct.id, ...newProduct.data() };
}

// Get a product by ID
async function getProductById(id) {
  const productDoc = await productCollection.doc(id).get();
  if (!productDoc.exists) throw new Error("Product not found");
  return { id: productDoc.id, ...productDoc.data() };
}

// Update a product
async function updateProduct(id, data) {
  await productCollection.doc(id).update(data);
  return { id, ...data };
}

// Delete a product
async function deleteProduct(id) {
  await productCollection.doc(id).delete();
  return { id };
}

// Get products by category
async function getProductsByCategory(category) {
  const productsSnapshot = await productCollection
    .where("category", "==", category)
    .get();
  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
