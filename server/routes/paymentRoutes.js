import { Router } from "express";

import auth from "./../middlewares/auth.js";
import { createPaymentIntent } from "../controllers/paymentController.js";

const router = Router();
// router.post("/checkout-session", auth, createCheckoutSession);
// router.get("/checkout-session/:sessionId", auth, getPaymentStatus);
router.post("/create-payment-intent", auth, createPaymentIntent);

export default router;
