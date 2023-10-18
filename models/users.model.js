import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    forgot_password_code: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    type: {
      type: String, // admin or user
    },
  },
  { timestamps: true }
);

// This method matches a User's password and can be used as: await TheUserFromDatabase.matchPassword(password)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * @description This rehashes a password if updated or changed.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model("user", userSchema);
export default User;
