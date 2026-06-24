import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = await MenuItem.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    await MenuItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
