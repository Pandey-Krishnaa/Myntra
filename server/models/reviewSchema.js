import { Schema, model } from "mongoose";
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
export default model("Review", reviewSchema);
