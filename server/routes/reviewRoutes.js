import { Router } from "express";
import auth from "./../middlewares/auth.js";
import { createReview } from "../controllers/reviewController.js";
const router = Router();
router.route("/:productId").post(auth, createReview);
export default router;
