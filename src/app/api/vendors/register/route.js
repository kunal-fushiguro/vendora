import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Vendor } from "@/models/vendor.model";

export async function POST(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = await request.json();
  const { storeName, storeDescription } = body;

  if (!storeName || !storeDescription) {
    return NextResponse.json(
      new ApiReponse(
        400,
        "All fields are required to register as vendor.",
        {},
        false
      ),
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid token.", {}, false),
        { status: 400 }
      );
    }

    // check user verifcation
    if (!user.isVerified) {
      return NextResponse.json(
        new ApiReponse(400, "User must be verified.", {}, false),
        { status: 400 }
      );
    }

    // update user and create a vendor
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      role: "Vendor",
    });
    const newVendor = await Vendor.create({
      storeName: storeName,
      storeDescription: storeDescription,
      products: [],
      orders: [],
      ratings: 0,
      reviews: [],
    });

    return NextResponse.json(
      new ApiReponse(
        201,
        "Vendor registered successfully.",
        {
          storeName: newVendor.storeName,
          storeDescription: newVendor.storeDescription,
          products: newVendor.products,
          orders: newVendor.orders,
          ratings: newVendor.ratings,
          reviews: newVendor.reviews,
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
      { status: 201 }
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
