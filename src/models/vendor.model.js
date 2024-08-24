import { Schema, model, models } from "mongoose";

const VendorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    storeName: {
      type: String,
      requiref: true,
    },
    storeDescription: {
      type: String,
      requiref: true,
    },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "products" },
      },
    ],
    orders: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: "orders" },
      },
    ],
    ratings: {
      type: Number,
    },
    reviews: [
      {
        reviewId: { type: Schema.Types.ObjectId, ref: "reviews" },
      },
    ],
  },
  { timestamps: true }
);

const Vendor = models.vendors || model("vendors", VendorSchema);

export { Vendor };
