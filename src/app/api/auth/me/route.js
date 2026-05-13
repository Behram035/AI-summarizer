import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db/connect";
import User from "../../../../lib/db/models/User";
import { getUserFromRequest } from "../../../../lib/utils/auth";

export async function GET(request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        summaryCount: user.summaryCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
