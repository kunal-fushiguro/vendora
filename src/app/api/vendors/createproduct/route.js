import { Vendor } from "@/models/vendor.model";
import { Product } from "@/models/products.model";
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
  const { name, description, price, images, category, stock } = body;

  if (!name || !description || !price || !images || !category || !stock) {
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

    // create a product and update vendor
    const newProduct = await Product.create({
      vendorId: vendor._id,
      name: name,
      description: description,
      price: price,
      images: [...images],
      category: category,
      stock: stock,
      ratings: 0,
      reviews: [],
    });
    // update vendor
    vendor.products.push({ productId: newProduct._id });
    await vendor.save();

    return NextResponse.json(
      new ApiReponse(
        201,
        "Product created successfully.",
        { ...newProduct },
        true
      ),
      { status: 201 }
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
