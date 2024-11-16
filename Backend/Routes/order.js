const express = require("express");
const { createOrder } = require("../Services/Orders");

const router = express.Router();

router.post("/new-order", createOrder);

module.exports = router;
