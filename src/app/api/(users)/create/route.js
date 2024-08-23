import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { hashPassword } from "@/utils/hashPassword";
import { createToken } from "@/utils/jwtTokens";
import { sendOtpEmailForVerification } from "@/utils/mail";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request) {
  const body = await request.json();
  const { username, email, password, profilePic } = body;

  // Fix the condition to check if any field is missing
  if (!username || !email || !password || !profilePic) {
    const response = new ApiReponse(400, "All Fields are required.", {}, false);
    return NextResponse.json(response, { status: 400 });
  }

  try {
    await dbConnect();

    // Check if the user exists
    const findUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (findUser) {
      const response = new ApiReponse(
        400,
        "Username and email must be unique.",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

    // Hash the password
    const newPassword = await hashPassword(password);

    // Send OTP
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const sendEmail = await sendOtpEmailForVerification(otp, username, email);
    if (!sendEmail) {
      const response = new ApiReponse(
        500,
        "An unexpected error occurred while sending the email.",
        {},
        false
      );
      return NextResponse.json(response, { status: 500 });
    }

    // Create a new user
    const newUser = await User.create({
      username: username,
      email: email,
      password: newPassword,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      role: "User",
      profilePic: profilePic,
      address: "",
      orders: [],
    });

    const userresponse = {
      email: newUser.email,
      username: newUser.username,
      isVerified: newUser.isVerified,
      role: newUser.role,
      profilePic: newUser.profilePic,
      address: newUser.address,
      orders: newUser.orders,
    };

    const response = new ApiReponse(
      201,
      "User created successfully.",
      userresponse,
      true
    );

    // Generate token and set it as a cookie
    const token = await createToken(newUser._id);
    const serialized = serialize("usertoken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json(response, {
      status: 201,
      headers: {
        "Set-Cookie": serialized,
      },
    });
  } catch (error) {
    console.error(error);
    const response = new ApiReponse(
      500,
      "An unexpected error occurred",
      {},
      false
    );
    return NextResponse.json(response, { status: 500 });
  }
}
