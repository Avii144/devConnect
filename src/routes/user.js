const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
  } catch (err) {
    res.send("something is error");
  }
});

//get all the pending connectons request from the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInuser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.send("something is error");
  }
});
module.exports = userRouter;
