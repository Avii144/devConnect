const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const user_Safe_Data = "firstName  lastName";

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
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "_id firstName lastName age gender about photoUrl"
      )
      .populate("toUserId", "_id firstName lastName age gender about photoUrl");

    // return the "other" user in each connection
    const data = connectionRequests.map((row) => {
      const from = row.fromUserId;
      const to = row.toUserId;
      const loggedId = String(loggedInUser._id);

      return String(from._id) === loggedId ? to : from;
    });

    res.json(data);
  } catch (err) {
    console.error("Connections Error:", err);
    res.status(500).json({ error: "Something went wrong" });
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
      hiddenUserFromFeed.add(req.fromUserId);
      hiddenUserFromFeed.add(req.toUserId);
    });
    // console.log(hiddenUserFromFeed);
    // console.log(connectionRequests);

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hiddenUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      // .select(user_Safe_Data)
      .skip(skip)
      .limit(limit);
    console.log(users);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
