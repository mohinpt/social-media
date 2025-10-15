import { connectToDB } from "@/lib/db";
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        connectToDB();
        const video = await Video.findById(params.id).lean();
        if (!video) {
            return NextResponse.json({ error: "Video not found!" }, { status: 404 });
        }
        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch video" },
            { status: 500 }
        );
    }
}