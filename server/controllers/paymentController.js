import catchAsnyc from "./../utils/catchAsync.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = catchAsnyc(async (req, res, next) => {
  const line_items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images.map((img) => img.url),
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
      metadata: {
        // Store product information for each item
        products: req.body.items.map((item) => {
          product_id: item._id;
          quantity: item.quantity;
          client: req.user._id;
          haiTO: "kcmxdcm";
        }),
      },
    };
  });

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      success_url: "https://www.google.com",
      cancel_url: "https://www.google.com",
      customer_email: req.user.email,
      line_items,
      mode: "payment",
    },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );

  res.status(200).json({ session });
});

export const getPaymentStatus = catchAsnyc(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.params.sessionId,
    { apiKey: process.env.STRIPE_SECRET_KEY, expand: "line_items" }
  );
  res.status(200).json(session);
});
