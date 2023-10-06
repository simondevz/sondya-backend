const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String, // admin or user
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;