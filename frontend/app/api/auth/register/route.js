import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { name, username, password } = await request.json();

    // 1. Basic validation
    if (!name || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lowerUsername = username.toLowerCase();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ username: lowerUsername });
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // 3. Create new user
    const newUser = await User.create({
      name,
      username: lowerUsername,
      password, 
      rewardPoints: 0
    });

    return NextResponse.json({ 
      message: "User created successfully",
      user: { id: newUser._id, username: newUser.username, name: newUser.name }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
