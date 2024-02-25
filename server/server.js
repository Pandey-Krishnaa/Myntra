import express, { json } from "express";
import { config } from "dotenv";
import connectDb from "./utils/db.js";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import cors from "cors";
import stripe from "stripe";
config({ path: "./utils/config.env" });
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 8000;
import Order from "./models/orderSchema.js";

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripeInstance.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_ENDPOINT
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const intentData = await stripeInstance.paymentIntents.retrieve(
          paymentIntentSucceeded.id
        );
        console.log(intentData);
        const order = await Order.findById(intentData.metadata.orderId);
        order.paymentStatus = "paid";
        await order.save();
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(json());
app.use(fileUpload({ useTempFiles: true }));


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/payments", paymentRoute);

// handling the not defined routes
app.all("*", (req, res, next) => {
  next(new ApiError(404, "route is not defined yet"));
});
// global error handler
app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "something went wrong";

  res.status(err.statusCode).json({
    message: err.message,
  });
});
app.listen(port, async () => {
  await connectDb();
  console.log(`app is running on port ${port}`);
});
