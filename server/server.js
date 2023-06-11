import express, { json } from "express";
import { config } from "dotenv";
config({ path: "./utils/config.env" });
const app = express();
app.use(json());
const port = process.env.PORT || 8000;
import connectDb from "./utils/db.js";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/userRoutes.js";
connectDb();

app.use("/api/v1/user", userRouter);

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
