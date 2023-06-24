import catchAsync from "../utils/catchAsync.js";
import Review from "./../models/reviewSchema.js";
import Product from "./../models/productSchema.js";
import ApiError from "../utils/ApiError.js";
export const createReview = catchAsync(async (req, res, next) => {
  let { title, rating } = req.body;
  if (!title) title = "no title";
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(400, "product does not exist"));
  const review = await Review.create({
    title,
    rating,
    author: req.user._id,
    product: product._id,
  });
  res.status(200).json({ review });
});
export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return next(new ApiError(404, "review does not exists"));
  if (req.user._id !== toString(review.author) && req.user.role !== "admin")
    return next(new ApiError(401, "you can't delete this review"));
  await Review.findByIdAndDelete(req.params.re);
  res.status(200).json({
    message: "review deleted successfully",
  });
});