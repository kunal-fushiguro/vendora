import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Vendor } from "@/models/vendor.model";

export async function GET() {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid token.", {}, false),
        { status: 400 }
      );
    }

    // check user is vendor or not
    if (!user.role === "Vendor") {
      return NextResponse.json(
        new ApiReponse(400, "User is not an vendor.", {}, false),
        { status: 400 }
      );
    }

    // find vendor
    const vendor = await Vendor.findOne({ userId: user._id }).populate([
      "orders",
      "products",
      "reviews",
    ]);
    if (!vendor) {
      return NextResponse.json(
        new ApiReponse(400, "Vendor not found.", {}, false),
        { status: 400 }
      );
    }

    // send data
    return NextResponse.json(
      new ApiReponse(
        200,
        "Get Vendor details successfully.",
        {
          storeName: vendor.storeName,
          storeDescription: vendor.storeDescription,
          products: vendor.products,
          orders: vendor.orders,
          ratings: vendor.ratings,
          reviews: vendor.reviews,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          role: user.role,
          profilePic: user.profilePic,
          address: user.address,
          orders: user.orders,
        },
        true
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiReponse(
        500,
        "Unexpected error occured while regitering the vendor.",
        {},
        false
      ),
      { status: 500 }
    );
  }
}
