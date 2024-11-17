const admin = require("firebase-admin");
const db = admin.firestore();
const ordersCollection = db.collection("orders");
const productCollection = db.collection("products");
const { v4: uuidv4 } = require("uuid");
const { createPayment, confirmStatus, PaymentError } = require("./payment"); // Import payment functions

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

    // Validate required fields and ensure none are undefined
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phoneNumber ||
      !totalAmount ||
      !userId ||
      !cart ||
      cart.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required to create an order" });
    }

    // Create order ID
    const orderId = uuidv4();

    console.log("Creating order with data:", {
      id: orderId,
      firstname,
      lastname,
      email,
      phoneNumber,
      totalAmount,
      userId,
      cart,
    });

    // Save order to Firestore with 'pending' payment status
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
      paymentStatus: "pending",
    });

    // Prepare payment data
    const paymentData = {
      orderId,
      amount: totalAmount,
      currency: "zmw",
      description: `Payment for order ${orderId}`,
      customerFirstName: firstname,
      customerLastName: lastname,
      email,
      phoneNumber,
    };

    // Initiate payment
    const paymentResponse = await createPayment(paymentData);
    console.log("this is payment id", paymentResponse.payment.id);

    // Confirm payment status
    const paymentStatus = await confirmStatus(paymentResponse.payment.id);

    // Update Firestore with payment status
    await ordersCollection.doc(orderId).update({
      paymentStatus: paymentStatus.payment.status,
      paymentDetails: paymentResponse,
    });

    // Check if payment is successful
    if (paymentStatus.payment.status === "success") {
      // Update product inventory by decreasing the quantities based on cart
      for (const cartItem of cart) {
        console.log("this is cart item", cartItem);
        if (
          cartItem.productId === undefined ||
          cartItem.quantity === undefined
        ) {
          throw new Error(
            `Invalid cart item data for product ${cartItem.productId}`
          );
        }

        const productSnapshot = await productCollection
          .where("id", "==", cartItem.productId)
          .get();

        if (!productSnapshot.empty) {
          const productDoc = productSnapshot.docs[0];
          const productData = productDoc.data();
          const newQuantity = productData.quantity - cartItem.quantity;

          // If quantity is still available, update the product
          if (newQuantity >= 0) {
            await productCollection.doc(productDoc.id).update({
              quantity: newQuantity,
            });
          } else {
            throw new PaymentError(
              `Not enough stock for product ${cartItem.productId}`,
              400
            );
          }
        } else {
          throw new PaymentError(
            `Product ${cartItem.productId} not found`,
            404
          );
        }
      }

      res.status(201).json({
        message: "Order created and payment successful",
        orderId,
        paymentStatus: paymentStatus.payment.status,
      });
    } else {
      res.status(400).json({
        message: "Payment failed",
        paymentStatus: paymentStatus.payment.status,
      });
    }
  } catch (error) {
    if (error instanceof PaymentError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }
};

module.exports = { createOrder };
