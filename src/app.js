const express = require("express");
const connectDB = require("./config/database");
const app = express();
connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is successfully listening to port 3000");
    });
  })
  .catch((err) => {
    console.error("database cannot be conneted ");
  });
