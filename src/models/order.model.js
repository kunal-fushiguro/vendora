import { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "vendors",
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = models.orders || model("orders", orderSchema);

export { Order };
