const express = require("express");
const { registerUser, loginUser } = require("../Services/admin");

const adminRouter = express.Router();

adminRouter.post("/signup", registerUser);
adminRouter.post("/login", loginUser);

module.exports = adminRouter;
