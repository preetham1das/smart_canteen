import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Can filter by status or userId
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');
  const today = searchParams.get('today'); // fetch today's orders

  await connectDB();

  let query = {};
  if (status) query.status = status;
  if (userId) query.user = userId;
  
  if (today) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: startOfDay };
  }

  try {
    const orders = await Order.find(query)
      .populate('user', 'name username role')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { items, scheduledPickupTime, totalAmount, userId } = body;

    // Generate unique token (e.g. T-402)
    const count = await Order.countDocuments();
    const tokenNumber = `T-${100 + count}`;

    const newOrder = await Order.create({
      user: userId || undefined,
      items,
      totalAmount,
      scheduledPickupTime: scheduledPickupTime ? new Date(scheduledPickupTime) : undefined,
      status: "Pending", // initial status
      tokenNumber,
    });

    // Award Gamification Points if user exists
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.rewardPoints += Math.floor(totalAmount / 10); // 1 point for every 10 rupees
        await user.save();
      }
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
