import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const body = await request.json();
    const { status } = body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name")
      .populate("items.menuItem");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // id can be mongo _id or tokenNumber
    let order = await Order.findById(id).populate("user", "name").populate("items.menuItem").catch(() => null);
    if (!order) {
      order = await Order.findOne({ tokenNumber: id }).populate("user", "name").populate("items.menuItem");
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
