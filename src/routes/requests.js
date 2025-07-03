const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
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
        res.send.json({
          message:
            req.user.firstName + "is " + status + "your " + userTo.firstName,
          data,
        });
      }
      res.send("not sent");
    } catch (err) {
      res.send("something is fishy:" + err.message);
    }
  }
);
module.exports = requestRouter;
