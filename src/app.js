const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
app.use(express.json());
const { validateSignUpData } = require("./utils/validations");

//signup api
app.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    const passwordhash = await bcrypt.hash(password, 10);

    //creating new instance for the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
    });

    ////you can use below method  for hardcoded values for dynamic one you need to use above method
    // const user = new User({
    //   firstname: "Avinash",
    //   lastname: "Pilli",
    //   emailId: "avinash@gmail.com",
    //   password: "avinash",
    // });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("somethig is wrong message:" + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email id not found");
    }
    const passisValid = await bcrypt.compare(password, user.password);
    if (passisValid) {
      res.send("Login successfull");
    } else {
      throw new Error("password not valid");
    }
  } catch (err) {
    res.send("something is error" + err.message);
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdates = ["age", "gender", "about", "skills"];
    const is_updateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );

    if (!is_updateAllowed) {
      throw new Error("update not allowed");
    }

    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("updated");
  } catch (err) {
    res.send("update failed");
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
