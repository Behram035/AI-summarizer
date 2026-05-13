import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db/connect";
import User from "../../../../lib/db/models/User";
import { generateToken } from "../../../../lib/utils/auth";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    return NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          summaryCount: user.summaryCount,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
