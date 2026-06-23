import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  try {
    const items = await MenuItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(request) {
  // Admin only
  await connectDB();
  try {
    const body = await request.json();
    const newItem = await MenuItem.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
