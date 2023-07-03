import catchAsnyc from "./../utils/catchAsync.js";
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = catchAsnyc(async (req, res, next) => {
  const line_items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item._id,
          images: item.images.map((img) => img.url),
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  // console.log("body->", req.body);
  const address = {
    line1: req.body.address.landmark,
    city: req.body.address.city,
    state: req.body.address.state,
    postal_code: req.body.address.postal_code,
  };
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: "https://www.google.com",
    cancel_url: "https://www.google.com",
    customer_email: req.user.email,
    line_items,
    mode: "payment",
    metadata: {
      line1: req.body.address.landmark,
      city: req.body.address.city,
      state: req.body.address.state,
      postal_code: req.body.address.postal_code,
    },
  });

  res.status(200).json({ session });
});

export const getPaymentStatus = catchAsnyc(async (req, res, next) => {
  const session = await stripeInstance.checkout.sessions.retrieve(
    req.params.sessionId,
    { apiKey: process.env.STRIPE_SECRET_KEY, expand: ["line_items"] }
  );
  // console.log(session.metadata);
  const data = {
    address: session.metadata,
    amount: session.amount_total,
    paymentStatus: session.payment_status,
  };
  console.log(data);
  res.status(200).json({ session });
});
