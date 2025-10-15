// /app/api/user/route.ts

import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    console.log("request receive for profile updation...");
    try {
        await connectToDB();
        const { userId, name, username, email, avatar } = await req.json();
        console.log("  userId, name, username, email, avatar",  userId, username, email, avatar);

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, username, email, avatar },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
