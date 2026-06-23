import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const users = await User.find({ role: "customer" })
      .select("name rewardPoints")
      .sort({ rewardPoints: -1 })
      .limit(10);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
