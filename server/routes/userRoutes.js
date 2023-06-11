import { Router } from "express";
import { signup, verifyOtp } from "../controllers/userController.js";
const router = Router();
router.route("/signup").post(signup);
router.route("/verification/:id").post(verifyOtp);
export default router;
