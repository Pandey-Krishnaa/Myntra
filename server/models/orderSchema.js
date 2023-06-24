import { Schema } from "mongoose";
const orderSchema = new Schema({
  shippingAddress: {
    type: String,
    required: [true, "shipping address is required"],
  },
  pincode: {
    type: Number,
    required: [true, "pincode is required"],
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      required: [true, "product id is required"],
      ref: "Product",
    },
  ],
  taxAmount: {
    type: Number,
    required: [true, "tax amount is required"],
  },
  discount: { type: Number },
  totalAmount: {
    type: Number,
    required: [true, "total amount is reuqi"],
  },
  paymentMethod: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
