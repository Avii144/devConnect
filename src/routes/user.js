const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const user_Safe_Data = "firstName,lastName ";

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
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInuser._id, status: "accepted" },
        { fromUserId: loggedInuser._id, status: "accepted" },
      ],
    }).populate("fromUserId", user_Safe_Data);
    const data = connectionRequests.map((row) => row.fromUserId);
    res.json({
      data,
    });
  } catch (err) {
    res.send("something is error");
  }
});
module.exports = userRouter;
