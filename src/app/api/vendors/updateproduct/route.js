import { Vendor } from "@/models/vendor.model";
import { Product } from "@/models/products.model";
import { dbConnect } from "@/database";
import { ApiReponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const cookie = await request.headers.get("cookie");
  const gettoken = cookie.split("usertoken=");
  const token = gettoken[1].trim();
  const data = await verifyToken(token);
  const { userId } = data;

  const body = await request.json();
  const { productId, name, description, price, images, category, stock } = body;

  if (
    !productId ||
    !name ||
    !description ||
    !price ||
    !images ||
    !category ||
    !stock
  ) {
    return NextResponse.json(
      new ApiReponse(
        400,
        "All fields are required to create a product.",
        {},
        false
      ),
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // find vendor
    const vendor = await Vendor.findOne({ userId: userId });
    if (!vendor) {
      return NextResponse.json(
        new ApiReponse(400, "Vendor not found.", {}, false),
        { status: 400 }
      );
    }

    // find product and update
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      name: name,
      description: description,
      price: price,
      images: images,
      category: category,
      stock: stock,
    });

    return NextResponse.json(
      new ApiReponse(
        200,
        "Product Updated Successfully",
        { ...updatedProduct },
        true
      ),
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
