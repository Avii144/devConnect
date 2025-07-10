const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email id not found");
    }
    const passisValid = await user.validatePassword(password);
    if (passisValid) {
      //create jwt token

      const token = await user.getJWT();
      console.log(token);
      // addthe token to the cookie send the response to the user with cookie

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("password not valid");
    }
  } catch (err) {
    res.send("something is error " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("logout successfully");
  } catch (err) {
    res.send("something is eroor");
  }
});
module.exports = authRouter;
