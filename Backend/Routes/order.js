const express = require("express");
const { createOrder, verifyAndUpdateOrder } = require("../Services/Orders");

const router = express.Router();

router.post("/new-order", createOrder);
router.post("/orders/verify", verifyAndUpdateOrder);

module.exports = router;
