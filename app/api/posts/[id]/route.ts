import { connectToDB } from "@/lib/db";
import post from "@/models/post";
import { NextResponse } from "next/server";


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;;
    const body = await req.json();
    const { content } = body;

    try {
        await connectToDB();

        const updatedPost = await post.findByIdAndUpdate(
            id,
            { content },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;;

    try {
        await connectToDB();
        const deletedPost = await post.findByIdAndDelete(id);
        if (!deletedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
