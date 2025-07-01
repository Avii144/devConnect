const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "others"].includes(val)) {
          throw new Error("Gnder data not valid");
        }
      },
    },

    city: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
    },
    skills: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
