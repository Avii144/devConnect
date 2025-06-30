const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://avinashlee:bYStM4piBoA6WxFI@avinashnode.kskvjfu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
