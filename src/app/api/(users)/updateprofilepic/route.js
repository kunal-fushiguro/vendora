import { dbConnect } from "@/database";
import { ApiReponse } from "@/utils/ApiResponse";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = await request.json();
  const { profilepic } = body;

  if (!profilepic) {
    const response = new ApiReponse(
      400,
      "profile picture url is required.",
      {},
      false
    );
    return NextResponse.json(response, { status: 400 });
  }

  try {
    await dbConnect();

    // find User
    const user = await User.findById(userId);

    if (!user) {
      const response = new ApiReponse(400, "Not a valid token", {}, false);
      return NextResponse.json(response, { status: 400 });
    }

    if (!user.isVerified) {
      const response = new ApiReponse(
        400,
        "Please verfiy the email to reset password",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

    //   update user profile

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      profilepic: profilepic,
    });
    return NextResponse.json(
      new ApiReponse(
        200,
        "User profile updated SuccessFully.",
        {
          email: updatedUser.email,
          username: updatedUser.username,
          isVerified: updatedUser.isVerified,
          role: updatedUser.role,
          profilePic: updatedUser.profilePic,
          address: updatedUser.address,
          orders: updatedUser.orders,
        },
        true
      ),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    const response = new ApiReponse(
      500,
      "Error Occured while verifying email.",
      {},
      false
    );
    return NextResponse.json(response, { status: 500 });
  }
}
