import { connectToDB } from "@/lib/db";
import post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    await connectToDB();

    if (!query || query.trim() === "") {
      const allPosts = await post.find().sort({ createdAt: -1 });
      return NextResponse.json(allPosts);
    }

    // Case-insensitive partial search on username and content
    const regex = new RegExp(query, "i");

    const posts = await post.find({
      $or: [{ username: regex }, { content: regex }],
    }).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 });
  }
}
