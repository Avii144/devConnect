const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const {
  validateProfileEdit,
  validateChangePassword,
} = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("something went wrong");
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
      throw new Error("Not able to edit");
    }

    const loggedInuser = req.user;
    Object.keys(req.body).forEach(
      (value) => (loggedInuser[value] = req.body[value])
    );
    console.log(loggedInuser);
    res.send("profile updated success");
  } catch (error) {
    res.send("something is fishy" + error.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    if (!validateChangePassword(req)) {
      throw new Error("need Strong password");
    }
    const user = req.user;
    console.log(user);
    password = req.body.password;

    res.send("pass changed successfully");
  } catch (err) {
    res.send("Something is wrong" + err.message);
  }
});
module.exports = profileRouter;
