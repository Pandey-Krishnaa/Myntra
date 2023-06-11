import User from "../models/userSchema.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const user = await User.create({ name, email, password, otp });
  const options = {
    email,
    subject: "Myntra-Clone {email varification}",
    html: `<p style="text-align:justify;">Dear ${name},<br/>Your otp is ${otp}.Use it to verify your account<br/>If you didn't request this,simply ignore this message</p><br/><h1 style="text-align:center;">${otp}</h1><br/>Your's<br/>The Myntra Clone Team.`,
  };

  await sendEmail(options);
  user.otpExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();
  console.log("email sent");
  res.status(201).json({
    message: `varify your email, has sent on ${email}`,
  });
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
    message: "email varified successfully",
  });
});
