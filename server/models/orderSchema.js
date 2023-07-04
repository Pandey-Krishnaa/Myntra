import { Schema, model } from "mongoose";
const orderSchema = new Schema({
  address: {
    landmark: {
      type: String,
      required: [true, "landmark is required"],
    },
    district: {
      type: String,
      required: [true, "district is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
    },
  },
  items: [{ product_id: Schema.Types.ObjectId, quantity: Number }],
  totalAmount: {
    type: Number,
    required: [true, "total amount is reuqi"],
  },
  paymentMethod: {
    type: String,
    default: "card",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  orderStatus: {
    type: String,
    enum: ["processing", "dispatched", "delivered", "cancelled"],
    default: "processing",
  },

  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Order", orderSchema);
