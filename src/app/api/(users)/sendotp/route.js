import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { verifyToken } from "@/utils/jwtTokens";
import { NextResponse } from "next/server";
import { sendOtpEmailForVerification } from "@/utils/mail";

export async function POST(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

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

    // Send OTP
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const sendEmail = await sendOtpEmailForVerification(
      otp,
      user.username,
      user.email
    );
    if (!sendEmail) {
      const response = new ApiReponse(
        500,
        "An unexpected error occurred while sending the email.",
        {},
        false
      );
      return NextResponse.json(response, { status: 500 });
    }

    // update user
    await User.findByIdAndUpdate(user._id, {
      verificationCode: Number(otp),
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    const response = new ApiReponse(
      200,
      "New OTP has been sent to your email.",
      {},
      true
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    const response = new ApiReponse(
      500,
      "Error Occured while sending  email.",
      {},
      false
    );
    return NextResponse.json(response, { status: 500 });
  }
}
