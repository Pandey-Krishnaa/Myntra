import { Schema, model } from "mongoose";
import sendEmail from "../utils/email.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    unique: [true, "email should be unique"],
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "password should have atleast 8 characters"],
  },
  isEmailVarified: {
    type: Boolean,
    required: [true, "email varification is required"],
    default: false,
  },
  otp: String,
  otpExpiration: Date,
});

export default model("User", userSchema);