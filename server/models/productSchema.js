import { Schema, model } from "mongoose";
const productSchema = new Schema(
  {
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
      validate: {
        validator: function (price) {
          return price > 0;
        },
        message: `price should be greater than 0`,
      },
    },
    category: {
      type: String,
      required: true,
      enum: ["topwear", "bottomwear", "innerwear", "footwear"],
    },
    forWhom: {
      type: String,
      enum: ["men", "woman", "kid"],
      required: [true, "for whom is required, it can be for men,women,kids"],
    },
    images: [{ public_id: String, url: String }],
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "stock count can't be less than 0",
      },
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    brand: { type: String },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true } }
);

productSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "product",
  ref: "Review",
});

export default model("Product", productSchema);
