import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db/connect";
import Summary from "../../../../lib/db/models/Summary";
import { getUserFromRequest } from "../../../../lib/utils/auth";

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const summary = await Summary.findOneAndDelete({ _id: params.id, userId });

    if (!summary)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    await connectDB();

    const summary = await Summary.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: body },
      { new: true },
    );

    if (!summary)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const summary = await Summary.findOne({ _id: params.id, userId });

    if (!summary)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
