import { ApiReponse } from "@/utils/ApiResponse";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(request) {
  const serialized = serialize("usertoken", "", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: true,
    expires: new Date(0),
  });

  return NextResponse.json(
    new ApiReponse(200, "User logged out successfully.", {}, true),
    {
      status: 200,
      headers: {
        "Set-Cookie": serialized,
      },
    }
  );
}
