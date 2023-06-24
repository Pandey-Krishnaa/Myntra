import { Router } from "express";
import auth from "./../middlewares/auth.js";
import { createReview, deleteReview } from "../controllers/reviewController.js";
const router = Router();
router.route("/:productId").post(auth, createReview);
router.route("/:reviewId").delete(auth, deleteReview);
export default router;
