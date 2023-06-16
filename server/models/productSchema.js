import { Schema, model } from "mongoose";
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{ public_id: String, url: String }],
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "product",
});

export default model("Product", productSchema);
