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

//delete api DELETE/user-- delete the userid
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfullyu");
  } catch (err) {
    res.send("something went wrong");
  }
});

//update the user
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("updated");
  } catch (err) {
    res.send("something went wrong");
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
