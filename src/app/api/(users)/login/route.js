import { dbConnect } from "@/database";
import { User } from "@/models/user.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { createToken } from "@/utils/jwtTokens";
import { NextResponse } from "next/server";
import { comparePassword } from "@/utils/hashPassword";
import { serialize } from "cookie";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;
  if (!email && !password) {
    const response = new ApiReponse(400, "All fields are required.", {}, false);
    return NextResponse.json(response, { status: 400 });
  }

  try {
    await dbConnect();

    // find user
    const user = await User.findOne({ email: email });
    if (!user) {
      const response = new ApiReponse(404, "User not found.", {}, false);
      return NextResponse.json(response, { status: 404 });
    }

    // check password is correct or not
    const isCorrect = await comparePassword(user.password, password);
    if (!isCorrect) {
      const response = new ApiReponse(400, "UnAuthraised Request.", {}, false);
      return NextResponse.json(response, { status: 400 });
    }

    // generate token
    const token = await createToken(user._id);
    const serialized = serialize("usertoken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    // login response
    return NextResponse.json(
      new ApiReponse(
        200,
        "User login SuccessFully.",
        {
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
      "Error Occured while logining a user..",
      {},
      false
    );
    return NextResponse.json(response, { status: 500 });
  }
}
