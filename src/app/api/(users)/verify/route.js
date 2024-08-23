import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { verifyToken } from "@/utils/jwtTokens";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = await request.json();

  const { otp } = body;

  if (!otp) {
    const response = new ApiReponse(400, "OTP is required.", {}, false);
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

    // check is he already verified or not
    if (user.isVerified) {
      const response = new ApiReponse(
        400,
        "User is already verified",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

    //  check otp
    if (!(user.verificationCode === Number(otp))) {
      const response = new ApiReponse(400, "Invalid OTP", {}, false);
      return NextResponse.json(response, { status: 400 });
    }

    // check otp is expired or not and then update
    if (user.verificationCode === Number(otp)) {
      if (user.verificationCodeExpiry > Date.now()) {
        await User.findByIdAndUpdate(userId, { isVerified: true });
        const response = new ApiReponse(
          200,
          "Email verifcation done",
          {},
          true
        );
        return NextResponse.json(response, { status: 200 });
      } else {
        const response = new ApiReponse(400, "OTP expired", {}, true);
        return NextResponse.json(response, { status: 400 });
      }
    }
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
