import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json();

        if (!email || !password || !username || username.trim() === "") {
            return NextResponse.json(
                { error: "Email, password, and username are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        await connectToDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email is already registered." },
                { status: 400 }
            );
        }

        const newUser = await User.create({
            email,
            password,
            username, 
        });

        console.log("New user ", newUser);

        return NextResponse.json(
            { message: "User registered successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in register route:", error);
        return NextResponse.json(
            { error: "Failed to register user." },
            { status: 500 }
        );
    }
}
