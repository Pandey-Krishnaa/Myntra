import { Schema, model } from "mongoose";
import Product from "./productSchema.js";
const reviewSchema = new Schema({
  title: {
    type: String,
    required: [true, "review title is required"],
  },
  author: {
    type: Schema.Types.ObjectId,
    required: [true, "author of review is required"],
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, "product is required"],
    ref: "Product",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});
reviewSchema.statics.calcRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        totalRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  const product = await Product.findById(productId);
  product.ratings = stats[0].avgRating;
  product.numberOfRatings = stats[0].totalRating;
  await product.save();
};
reviewSchema.post("save", async function () {
  this.constructor.calcRatings(this.product);
});

export default model("Review", reviewSchema);
