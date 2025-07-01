const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read the token from req cookies
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("token is not valid");
    }
    const decodedData = await jwt.verify(token, "@Vinash144$");
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();

    // validate the token
    //find the user
  } catch (errr) {
    res.status(400).send("something went wrong: " + errr.message);
  }
};
module.exports = { userAuth };
