const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const user = require("../models/user");
const userRouter = express.Router();
const ConnectionRequest=require("../models/connectionRequest")

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    
  } catch (err) {
    res.send("something is error");
  }
});
module.exports = userRouter;
