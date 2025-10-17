import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export interface MediaData {
    type: "image" | "video";
    url: string;
}

export interface PostFormData {
    content: string;
    username: string,
    media?: MediaData | null;
}

type postDataType = {
    owner: string;
    content: string;
    username: string,
    media?: PostFormData["media"];
}


// GET all posts (public)
export async function GET() {
    try {
        await connectToDB();
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate("owner", "username")
            .lean();

        return NextResponse.json(posts);
    } catch (error) {
        console.error("GET posts error:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST a new post (requires auth)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDB();
        const body: PostFormData = await request.json();
        const { content, username, media } = body;

        if (!content || content.trim() === '') {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        //Construct the post data
        const postData: postDataType = {
            owner: session.user._id,
            content,
            username,
        };


        //Add media only if present
        if (media && media.url && media.type) {
            postData.media = { type: media.type, url: media.url };
        }

        const newPost = await Post.create(postData);

        //Update user's postIds array
        await User.findByIdAndUpdate(session.user._id, {
            $push: { postIds: newPost._id },
        });

        const populatedPost = await Post.findById(newPost._id)
            .populate("owner", "username")
            .lean();

        return NextResponse.json(populatedPost, { status: 201 });

    } catch (error) {
        console.error("POST post error:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}

