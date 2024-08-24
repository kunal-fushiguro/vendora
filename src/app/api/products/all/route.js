import { Product } from "@/models/products.model";
import { dbConnect } from "@/database";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const products = await Product.find({}).limit(50);
    return NextResponse.json(
      new ApiReponse(
        200,
        "Product fetch successfully.",
        {
          products: {
            ...products,
          },
        },
        false
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiReponse(500, "internal server error", {}, false),
      { status: 500 }
    );
  }
}
