import catchAsync from "../utils/catchAsync.js";
import Review from "./../models/reviewSchema.js";
import Product from "./../models/productSchema.js";
import ApiError from "../utils/ApiError.js";
export const createReview = catchAsync(async (req, res, next) => {
  let { title, rating } = req.body;
  console.log(req.body);
  if (!title) title = "no title";
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(400, "product does not exist"));
  let review = await Review.findOne({
    author: req.user._id,
    product: productId,
  });
  if (review) {
    review.title = title;
    review.rating = rating;
    review = await review.save();
  } else {
    review = await Review.create({
      title,
      rating,
      author: req.user._id,
      product: product._id,
    });
  }
  console.log(review);
  res.status(200).json({ review });
});
export const deleteReview = catchAsync(async (req, res, next) => {
  // console.log("called");
  const review = await Review.findById(req.params.reviewId);
  // console.log(req.user._id);
  // console.log(review.author);
  // console.log(req.user.role);
  if (!review) return next(new ApiError(404, "review does not exists"));
  if (
    toString(req.user._id) !== toString(review.author) &&
    req.user.role !== "admin"
  )
    return next(new ApiError(401, "you can't delete this review"));
  const productId = review.product;

  await Review.findByIdAndDelete(req.params.reviewId);
  await Review.calcRatings(productId);
  res.status(200).json({
    message: "review deleted successfully",
  });
});
