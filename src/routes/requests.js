const express = require("express");
const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest", async (req, res) => {
  res.send("connection request sent");
});
module.exports = requestRouter;
