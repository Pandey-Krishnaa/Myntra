import User from "../models/userSchema.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/otpGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const signup = catchAsync(async (req, res, next) => {
  const avatar = req.files?.avatar;
  if (!avatar) return next(new ApiError(400, "profile picture is required"));
  const { name, email, password } = req.body;
  if (password?.length < 8)
    return next(new ApiError(400, "password should have atleast 8 characters"));
  const otp = generateOtp();
  const encryPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: encryPassword, otp });
  if (avatar) {
    console.log("uploading avatar......");
    const uploadRes = await cloudinary.v2.uploader.upload(avatar.tempFilePath);
    user.avatar.url = uploadRes.secure_url;
    user.avatar.public_id = uploadRes.public_id;
  }
  const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/user/verification/${user._id}`;
  const options = {
    email,
    subject: "Myntra-Clone {email varification}",
    html: `<p style="text-align:justify;">Dear ${name},<br/>Your otp is ${otp}.Use it to verify your account<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`,
  };
  let isEmailSent = false;
  await sendEmail(options, isEmailSent);

  user.otpExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();
  console.log("email sent");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(201).json({
    message: isEmailSent
      ? `varify your email, has sent on ${email}`
      : "email couldn't sent ",
    token,
    url,
    user,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError(400, "enter your email or password"));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ApiError(400, "invalid credential"));
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatched)
    return next(new ApiError(400, "invalid cridential"));
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  delete user.password;
  res.status(200).json({ message: "logged in", token, user });
});

export const getLoggedInUser = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.user });
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const userid = req.params.id;
  let user = await User.findById(userid);
  if (!user) return next(new ApiError(400, "invalid user id"));
  console.log(req.body);
  const otp = req.body.otp;
  if (!otp) return next(new ApiError(400, "enter your otp"));
  if (otp * 1 !== user.otp * 1) return next(new ApiError(401, "incorrect otp"));
  if (user.otpExpiration < Date.now())
    return next(new ApiError(401, "otp expired"));
  user.otp = undefined;
  user.otpExpiration = undefined;
  user.isEmailVarified = true;
  user = await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "email verified successfully",
    user,
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email, subject } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(400, "invalid email"));
  const otp = generateOtp();
  let html = "";
  let emailSubject = "";
  if (subject === "emailVerification") {
    html = `<p style="text-align:justify;">Dear ${user.name},<br/>Your otp is ${otp}.Use it to verify your email<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`;
    emailSubject = "Email Verification OTP {Myntra}";
  }
  if (subject === "resetPassword") {
    html = `<p style="text-align:justify;">Dear ${user.name},<br/>Your otp is ${otp}.Use it to reset your passwrod<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`;
    emailSubject = "Reset Password OTP {Myntra}";
  }
  const options = {
    subject: emailSubject,
    email,
    html,
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

export const changeAvatar = catchAsync(async (req, res, next) => {
  const avatar = req.files?.avatar;
  if (!avatar) return next(new ApiError(400, "please select a avatar"));
  let user = await User.findById(req.user._id);
  // deleting the previous avatar from cloudinary
  if (user.avatar?.public_id)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  const uploadRes = await cloudinary.v2.uploader.upload(avatar?.tempFilePath);
  user.avatar.url = uploadRes.secure_url;
  user.avatar.public_id = uploadRes.public_id;
  user = await user.save();
  res.status(200).json({ message: "avatar uploaded", user });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);
  if (!oldPassword || !newPassword)
    return next(new ApiError(400, "both feilds are required"));
  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  if (!(await bcrypt.compare(oldPassword, user.password)))
    return next(new ApiError(401, "incorrect password"));
  if (await bcrypt.compare(newPassword, user.password))
    return next(new ApiError(400, "both password are same"));
  if (newPassword.length < 8)
    return next(new ApiError(400, "password should have atleast 8 characters"));
  // hash the new password
  const encryptedNewPassword = await bcrypt.hash(newPassword, 12);
  user.password = encryptedNewPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ message: "password changed" });
});

export const deleteMyAccount = catchAsync(async (req, res, next) => {
  const email = req.body.email || req.user.email;
  const password = req.body.password;
  if (!email) return next(new ApiError(400, "enter your email"));
  if (!password) return next(new ApiError(400, "enter your password"));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ApiError(404, "user does not exist"));
  if (!(await bcrypt.compare(password, user.password)))
    return next(new ApiError(401, "incorrect password"));
  await User.findByIdAndDelete(user._id);
  res.status(200).json({
    message: "account deleted successfully",
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  if (!user) return next(new ApiError(404, "user does not exists"));
  user.name = req.body.name;
  user = await user.save();
  res.status(200).json({ user });
});
