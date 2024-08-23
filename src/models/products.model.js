import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "vendors",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "reviews",
      },
    ],
  },
  { timestamps: true }
);

const Product = models.products || model("products", ProductSchema);

export { Product };
