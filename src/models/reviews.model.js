import { Schema, model, models } from "mongoose";

const reviewsSchema = new Schema(
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
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = models.reviews || model("reviews", reviewsSchema);

export { Review };
