import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Image, { IImage } from "@/models/image";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        await connectToDB();
        const images = await Image.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(images, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch images" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDB();
        const body: IImage = await request.json();

        if (!body.title || !body.description || !body.imageUrl) {
            return NextResponse.json(
                { error: "Missing required fields!" },
                { status: 400 }
            )
        }

        const newImage = await Image.create(body);
        return NextResponse.json(newImage);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create an Image" },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        
        const { id, title, description, imageUrl } = await request.json();
        if(!id){
            return NextResponse.json({error: "Missing image id"}, {status: 401});
        }
        await connectToDB();

        const updateImage = await Image.findByIdAndDelete(
            id,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(imageUrl && { imageUrl}),
            },
        );
        if (!updateImage) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(updateImage);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
    }
}