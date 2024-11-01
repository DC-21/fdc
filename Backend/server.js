const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./firebaseAdmin");
const productRoutes = require("./Routes/productRoutes"); // Import product routes

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("<h2>Farmers connect backend server up and running!</h2>");
});

// Use product routes
app.use("/products", productRoutes); // Add this line to use product routes

// Server port
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
