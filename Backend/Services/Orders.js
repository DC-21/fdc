const admin = require("firebase-admin");
const db = admin.firestore();
const ordersCollection = db.collection("orders");
const { v4: uuidv4 } = require("uuid");

const createOrder = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      totalAmount,
      userId,
      cart,
    } = req.body;

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phoneNumber ||
      !totalAmount ||
      !userId ||
      !cart
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required to create an order" });
    }

    // Create order ID
    const orderId = uuidv4();

    // Save order to Firestore
    await ordersCollection.doc(orderId).set({
      id: orderId,
      firstname,
      lastname,
      email,
      phoneNumber,
      totalAmount,
      userId,
      cart,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

module.exports = { createOrder };
