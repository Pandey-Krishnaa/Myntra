import { Router } from "express";
import {
  changeAvatar,
  changePassword,
  deleteMyAccount,
  forgetPassword,
  getLoggedInUser,
  login,
  resetPassword,
  signup,
  verifyOtp,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = Router();
router.route("/me").get(auth, getLoggedInUser);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verification/:id").post(verifyOtp);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:email").post(resetPassword);
router.route("/change-avatar").post(auth, changeAvatar);
router.route("/change-password").post(auth, changePassword);
router.route("/").delete(auth, deleteMyAccount);
router.route("/protected").get(auth, (req, res, next) => {
  res.status(200).json({
    message: "protected",
  });
});
export default router;
