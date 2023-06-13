import User from "../models/userSchema.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/otpGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import fs from "fs";

export const signup = catchAsync(async (req, res, next) => {
  const avatar = req.files.avatar;
  const { name, email, password } = req.body;
  const otp = generateOtp();
  const encryPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: encryPassword, otp });
  if (avatar) {
    // console.log(avatar);
    const path = `./uploads/${Date.now()}${avatar.name}`;
    avatar.mv(path, (err) => {
      if (err) throw new Error("file couldn't uploaded");
    });
    console.log("uploading");
    const uploadRes = await cloudinary.v2.uploader.upload(path);
    user.avatar.url = uploadRes.secure_url;
    user.avatar.public_id = uploadRes.public_id;
    fs.unlink(path, (err) => {
      if (err) throw new Error("something went wrong");
      console.log("file deleted");
    });
  }
  const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/user/verification/${user._id}`;
  const options = {
    email,
    subject: "Myntra-Clone {email varification}",
    html: `<p style="text-align:justify;">Dear ${name},<br/>Your otp is ${otp}.Use it to verify your account<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`,
  };
  await sendEmail(options);
  user.otpExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();
  console.log("email sent");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(201).json({
    message: `varify your email, has sent on ${email}`,
    token,
    url,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError(400, "enter your email or password"));
  const user = await User.findOne({ email });
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatched)
    return next(new ApiError(400, "invalid cridential"));
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  res.status(200).json({ message: "logged in", token });
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const userid = req.params.id;
  const user = await User.findById(userid);
  if (!user) return next(new ApiError(400, "invalid user id"));
  const otp = req.body.otp;
  if (!otp) return next(new ApiError(400, "enter your otp"));
  if (otp * 1 !== user.otp * 1) return next(new ApiError(401, "incorrect otp"));
  if (user.otpExpiration < Date.now())
    return next(new ApiError(401, "otp expired"));
  user.otp = undefined;
  user.otpExpiration = undefined;
  user.isEmailVarified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "email verified successfully",
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(400, "invalid email"));
  const otp = generateOtp();
  const options = {
    email,
    subject: "Myntra-Clone {Reset Password OTP}",
    html: `<p style="text-align:justify;">Dear ${user.name},<br/>Your otp is ${otp}.Use it to change your password<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`,
  };
  await sendEmail(options);
  user.otp = otp;
  user.otpExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();
  res.status(200).json({ message: "email sent" });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const { password, otp } = req.body;
  if (!email) return next(new ApiError(400, "enter your email"));
  if (!password) return next(new ApiError(400, "enter your new password"));
  if (!otp) return next(new ApiError(400, "enter your otp"));
  const user = await User.findOne({ email });
  if (otp * 1 !== user.otp * 1) return next(new ApiError(401, "incorrect otp"));
  if (user.otpExpiration < Date.now())
    return next(new ApiError(401, "otp expired"));
  user.otp = undefined;
  user.otpExpiration = undefined;
  user.password = await bcrypt.hash(password, 12);
  await user.save();
  res.status(200).json({ message: "password changed successfully" });
});
