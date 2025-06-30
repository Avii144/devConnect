const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());
//signup api
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  ////you can use below method  for hardcoded values for dynamic one you need to use above method
  // const user = new User({
  //   firstname: "Avinash",
  //   lastname: "Pilli",
  //   emailId: "avinash@gmail.com",
  //   password: "avinash",
  // });
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("somethig is wrong message:" + err.message);
  }
});
//get user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(500).send("something is wrong :" + err.message);
  }
});
//feed api GET/feed--get all the users from the feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went wrong");
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
