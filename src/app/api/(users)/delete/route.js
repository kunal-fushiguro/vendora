import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function DELETE(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;
  try {
    await dbConnect();
    // find user and check is he verify or not

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

    // delete the user

    await User.findByIdAndDelete(user._id);

    const serialized = serialize("usertoken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(0),
    });

    return NextResponse.json(
      new ApiReponse(200, "User Account Deleted successfully.", {}, true),
      {
        status: 200,
        headers: {
          "Set-Cookie": serialized,
        },
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
