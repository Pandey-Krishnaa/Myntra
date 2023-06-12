import jwt from "jsonwebtoken";
import User from "./../models/userSchema.js";
import ApiError from "../utils/ApiError.js";
const auth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) return next(new ApiError(401, "token is not defined"));
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user) return next(new ApiError(401, "user does not exists"));
    req.user = user;
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
  next();
};
export default auth;
