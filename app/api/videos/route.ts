import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import imagekit from "@/lib/imagekit";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        await connectToDB();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDB();
        const body: IVideo = await request.json();

        if (!body.title || !body.description || !body.videoUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo);

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create a video" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id, title, description } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Missing video id" }, { status: 400 });
        }
        await connectToDB();
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(description && { description })
            },
            { new: true }
        )
        if (!updatedVideo) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(updatedVideo);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Missing video id" }, { status: 400 })
        }

        await connectToDB();

        const video = await Video.findById(id);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        //Delete from ImageKit first
        if (video?.fileId) {
            await imagekit.deleteFile(video.fileId);
        }

        await video.deleteOne();
        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }
}