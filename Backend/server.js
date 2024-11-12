const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { db } = require("./firebaseAdmin");
const productRoutes = require("./Routes/productRoutes");
const authRoutes = require("./Routes/auth");
const uploadImageRouter = require("./upload/index");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
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
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadImageRouter);

// Server port
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
