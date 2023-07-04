import catchAsnyc from "./../utils/catchAsync.js";
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
export const createPaymentIntent = catchAsnyc(async (req, res, next) => {
  const paymentIntent = await stripeInstance.paymentIntents.create(
    {
      amount: req.body.amount,
      currency: "inr",
      metadata: { orderId: req.body.orderId, customerId: req.user._id },
      automatic_payment_methods: { enabled: true },
    },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );
  res.status(200).json({ paymentIntent });
});
