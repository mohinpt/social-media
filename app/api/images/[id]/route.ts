import { connectToDB } from "@/lib/db";
import Image from "@/models/image";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const image = await Image.findById(params.id).lean();
        if (!image) {
            return NextResponse.json({ error: "Image is not found" }, { status: 404 });
        }
        return NextResponse.json(image);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch image" },
            { status: 500 }
        );
    }
}