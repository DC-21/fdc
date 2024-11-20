const admin = require("firebase-admin");
const db = admin.firestore();
const ordersCollection = db.collection("orders");
const productCollection = db.collection("products");
const { v4: uuidv4 } = require("uuid");
const { createPayment, confirmStatus, PaymentError } = require("./payment"); // Import payment functions

// const createOrder = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       email,
//       phoneNumber,
//       totalAmount,
//       userId,
//       cart,
//       orderId
//     } = req.body;

//     // Validate required fields and ensure none are undefined
//     if (
//       !firstname ||
//       !lastname ||
//       !email ||
//       !phoneNumber ||
//       !totalAmount ||
//       !userId ||
//       !cart ||
//       !orderId||
//       cart.length === 0
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All fields are required to create an order" });
//     }

//     // Create order ID
//     const Id = uuidv4();

//     console.log("Creating order with data:", {
//       id: Id,
//       firstname,
//       lastname,
//       email,
//       phoneNumber,
//       totalAmount,
//       userId,
//       orderId,
//       cart,
//     });

//     // Save order to Firestore with 'pending' payment status
//     await ordersCollection.doc(orderId).set({
//       id: orderId,
//       firstname,
//       lastname,
//       email,
//       phoneNumber,
//       totalAmount,
//       userId,
//       orderId,
//       cart,
//       createdAt: new Date().toISOString(),
//       paymentStatus: "pending",
//     });

//     // Prepare payment data
//     const paymentData = {
//       orderId,
//       amount: totalAmount,
//       currency: "zmw",
//       description: `Payment for order ${orderId}`,
//       customerFirstName: firstname,
//       customerLastName: lastname,
//       email,
//       phoneNumber,
//     };

//     // Initiate payment
//     const paymentResponse = await createPayment(paymentData);
//     console.log("this is payment id", paymentResponse.payment.id);

//     // Confirm payment status
//     const paymentStatus = await confirmStatus(paymentResponse.payment.id);

//     // Update Firestore with payment status
//     await ordersCollection.doc(orderId).update({
//       paymentStatus: paymentStatus.payment.status,
//       paymentDetails: paymentResponse,
//     });

//     // Check if payment is successful
//     if (paymentStatus.payment.status === "success") {
//       // Update product inventory by decreasing the quantities based on cart
//       for (const cartItem of cart) {
//         console.log("this is cart item", cartItem);
//         if (
//           cartItem.productId === undefined ||
//           cartItem.quantity === undefined
//         ) {
//           throw new Error(
//             `Invalid cart item data for product ${cartItem.productId}`
//           );
//         }

//         const productSnapshot = await productCollection
//           .where("id", "==", cartItem.productId)
//           .get();

//         if (!productSnapshot.empty) {
//           const productDoc = productSnapshot.docs[0];
//           const productData = productDoc.data();
//           const newQuantity = productData.quantity - cartItem.quantity;

//           // If quantity is still available, update the product
//           if (newQuantity >= 0) {
//             await productCollection.doc(productDoc.id).update({
//               quantity: newQuantity,
//             });
//           } else {
//             throw new PaymentError(
//               `Not enough stock for product ${cartItem.productId}`,
//               400
//             );
//           }
//         } else {
//           throw new PaymentError(
//             `Product ${cartItem.productId} not found`,
//             404
//           );
//         }
//       }

//       res.status(201).json({
//         message: "Order created and payment successful",
//         orderId,
//         paymentStatus: paymentStatus.payment.status,
//       });
//     } else {
//       res.status(400).json({
//         message: "Payment failed",
//         paymentStatus: paymentStatus.payment.status,
//       });
//     }
//   } catch (error) {
//     if (error instanceof PaymentError) {
//       res.status(error.statusCode).json({ message: error.message });
//     } else {
//       console.log(error);
//       res
//         .status(500)
//         .json({ message: "Error creating order", error: error.message });
//     }
//   }
// };

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
      orderId,
    } = req.body;

    // Validate if all required fields are provided
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phoneNumber ||
      !totalAmount ||
      !userId ||
      !cart ||
      !orderId ||
      cart.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required to create an order" });
    }

    console.log("Creating order with data:", {
      firstname,
      lastname,
      email,
      phoneNumber,
      totalAmount,
      userId,
      orderId,
      cart,
    });

    // Generate unique ID for the order
    const Id = uuidv4();

    // Create the order record in the database with payment status as pending
    await ordersCollection.doc(orderId).set({
      id: Id,
      firstname,
      lastname,
      email,
      phoneNumber,
      totalAmount,
      userId,
      orderId,
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

    // Initiate the payment process (Assuming `createPayment` is an API call)
    const paymentResponse = await createPayment(paymentData);

    console.log("this is payment response", paymentResponse);

    // If payment initiation is successful, update the order with payment ID
    if (
      paymentResponse &&
      paymentResponse.payment &&
      paymentResponse.payment.id
    ) {
      // Update the order with payment ID and set payment status to "initiated"
      await ordersCollection.doc(orderId).update({
        paymentStatus: "initiated",
        paymentId: paymentResponse.payment.id,
      });

      // Respond back to the client with success and payment details
      return res.status(201).json({
        message: "Order created and payment initiated",
        orderId,
        paymentId: paymentResponse.payment.id,
      });
    } else {
      throw new Error("Payment initiation failed");
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

const verifyAndUpdateOrder = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    if (!orderId || !paymentId) {
      return res
        .status(400)
        .json({ message: "Order ID and Payment ID are required" });
    }

    const paymentStatus = await confirmStatus(paymentId);

    await ordersCollection.doc(orderId).update({
      paymentStatus: paymentStatus.payment.status,
      paymentDetails: paymentStatus,
    });

    if (paymentStatus.payment.status === "success") {
      const orderSnapshot = await ordersCollection.doc(orderId).get();

      if (!orderSnapshot.exists) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderData = orderSnapshot.data();
      const { cart } = orderData;

      for (const cartItem of cart) {
        const productSnapshot = await productCollection
          .where("id", "==", cartItem.productId)
          .get();

        if (!productSnapshot.empty) {
          const productDoc = productSnapshot.docs[0];
          const productData = productDoc.data();
          const newQuantity = productData.quantity - cartItem.quantity;

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

      res.status(200).json({
        message: "Order updated successfully",
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
      res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  }
};

module.exports = { createOrder, verifyAndUpdateOrder };
