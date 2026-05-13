import { NextResponse } from "next/server";
import connectDB from "../../../lib/db/connect";
import Summary from "../../../lib/db/models/Summary";
import { getUserFromRequest } from "../../../lib/utils/auth";

export async function GET(request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const favorite = searchParams.get("favorite");
    const skip = (page - 1) * limit;

    await connectDB();

    const query = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (favorite === "true") {
      query.isFavorite = true;
    }

    const [summaries, total] = await Promise.all([
      Summary.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-originalText")
        .lean(),
      Summary.countDocuments(query),
    ]);

    return NextResponse.json({
      summaries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
