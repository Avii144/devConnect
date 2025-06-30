const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstname: "Avinash",
    lastname: "Pilli",
    emailId: "avinash@gmail.com",
    password: "avinash",
  });
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("somethig is wrong message:" + err.message);
  }
});
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
