const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const db = admin.firestore();
const adminCollection = db.collection("users");

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;

    // Check if admin already exists
    const querySnapshot = await adminCollection
      .where("email", "==", email)
      .get();
    if (!querySnapshot.empty) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save admin to Firestore using an auto-generated ID
    await adminCollection.add({
      fullname,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const querySnapshot = await adminCollection
      .where("email", "==", email)
      .get();
    if (querySnapshot.empty) {
      return res.status(400).json({ message: "User not found" });
    }

    const doc = querySnapshot.docs[0];

    const user = {
      fullname: doc.data().fullname,
      email: doc.data().email,
      phone: doc.data().phone,
    };

    // Validate password
    const isValid = await bcrypt.compare(password, doc.data().password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res
      .status(200)
      .json({ message: "User logged in successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
