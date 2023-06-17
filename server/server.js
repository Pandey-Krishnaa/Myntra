import express, { json } from "express";
import { config } from "dotenv";
import connectDb from "./utils/db.js";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
config({ path: "./utils/config.env" });
const app = express();
const port = process.env.PORT || 8000;
app.use(json());
app.use(fileUpload());
connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
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
