const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const user_Safe_Data = "firstName, lastName ";

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserFromFeed.add(req.fromUserId.toString());
      hiddenUserFromFeed.add(req.toUserId.toString());
    });

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hiddenUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(user_Safe_Data)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
