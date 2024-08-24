import { dbConnect } from "@/database";
import { Vendor } from "@/models/vendor.model";
import { Product } from "@/models/products.model";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = request.json();
  const { productId } = body;

  if (!productId) {
    return NextResponse.json(
      new ApiReponse(
        400,
        "productID is required to delete the product.",
        {},
        false
      ),
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // find vendor and delete the product id form products
    const vendor = await Vendor.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          products: {
            productId: productId,
          },
        },
      },
      { multi: true }
    );
    if (!vendor) {
      return NextResponse.json(
        new ApiReponse(400, "Vendor or product not found", {}, false),
        { status: 400 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      new ApiReponse(200, "Product deleted successfully", {}, true),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const response = new ApiReponse(
      500,
      "Error Occured while creating a product.",
      {},
      false
    );
    return NextResponse.json(response, { status: 500 });
  }
}
