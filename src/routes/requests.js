const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      const userTo = await user.findById(toUserId);
      if (!userTo) {
        res.send({ message: "user not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.send({ message: "Connection request already exists" });
      }

      const connectRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //  if (connectRequest.fromUserId.equals(connectRequest.toUserId)) {
      //    throw new Error("Cannot send ");
      //  }

      if (allowedStatus.includes(status)) {
        const data = await connectRequest.save();
        const emailres = await sendEmail.run();
        console.log(emailres);
        res.json({
          message:
            req.user.firstName + " is " + status + " in  " + userTo.firstName,
          data,
        });
      }
      res.send("not sent");
    } catch (err) {
      res.send("something is fishy:" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      //or
      //const {status,requestId}=req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not allowed " });
      }
      const connectionRequest = await ConnectionRequest.findById({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.json({ message: "connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request " + status, data });
    } catch (err) {
      res.send("Something is error");
    }
  }
);
module.exports = requestRouter;
