import { Router } from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import auth from "./../middlewares/auth.js";
import { getPaymentStatus } from "../controllers/paymentController.js";
const router = Router();
router.post("/checkout-session", auth, createCheckoutSession);
router.get("/checkout-session/:sessionId", auth, getPaymentStatus);

export default router;
