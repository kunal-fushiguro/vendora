import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    verificationCodeExpiry: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    profilePic: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "orders",
      },
    ],
  },
  { timestamps: true }
);

const User = models.users || model("users", UserSchema);

export { User };
