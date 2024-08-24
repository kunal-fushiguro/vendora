import { User } from "@/models/user.model";
import { Vendor } from "@/models/vendor.model";
import { Order } from "@/models/order.model";
import { dbConnect } from "@/database";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = await request.json();
  const { productId, quantity, totalPrice, paymentStatus } = body;

  if (!productId || !quantity || !totalPrice || !paymentStatus) {
    return NextResponse.json(
      new ApiReponse(400, "Bad request all fields are required", {}, false),
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // find product
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiReponse(500, "unexpected error occurred", {}, false),
      { status: 500 }
    );
  }
}
