import express, { json } from "express";
import { config } from "dotenv";
import connectDb from "./utils/db.js";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import cors from "cors";
import stripe from "stripe";

config({ path: "./utils/config.env" });

const app = express();
const port = process.env.PORT || 8000;

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

app.post(
  "/stripe/webhook",
  (request, response, next) => {
    let rawBody = "";
    request
      .on("data", (chunk) => {
        rawBody += chunk;
      })
      .on("end", () => {
        request.rawBody = rawBody;

        next();
      });
  },
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_ENDPOINT
      );
      console.log(event);
    } catch (err) {
      response.status(400).json({ message: err.message });
      return;
    }
    // Handle the event
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        console.log("payment failed--> ", checkoutSessionAsyncPaymentFailed);
        break;
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        console.log("success -> ", checkoutSessionAsyncPaymentSucceeded);
        break;
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data;
        const sessionWithLineItems =
          await stripeInstance.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ["line_items"],
            }
          );
        console.log("session->", sessionWithLineItems);
        const lineItems = sessionWithLineItems.line_items.data;

        console.log("line items->", lineItems);
        console.log(
          "product data->",
          checkoutSessionCompleted.object.line_items
        );
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id
        );

        // Iterate over the line_items and access the metadata for product information
        for (const lineItem of session.display_items) {
          const { product_id, name, description, images } = lineItem.metadata;

          // Use the product information as needed
          console.log(`Product ID: ${product_id}`);
          console.log(`Name: ${name}`);
          console.log(`Description: ${description}`);
          console.log(`Images: ${images}`);
        }

        response.status(200).json({ message: "payment successfull.........." });
        break;
      case "checkout.session.failed":
        const checkoutSessionFailed = event.data;
        console.log("failed-> ", checkoutSessionFailed);
        response.status(400).json({ message: "payment failed.........." });
        break;
      // ... handle other event types
      default:
        response.json(400).json({ message: "something went wrong" });
    }
  }
);
app.use(json());
app.use(fileUpload());
connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/payments", paymentRoute);

// handling the not defined routes
app.all("*", (req, res, next) => {
  next(new ApiError(404, "route is not defined yet"));
});
// global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "something went wrong";

  res.status(err.statusCode).json({
    message: err.message,
  });
});
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
