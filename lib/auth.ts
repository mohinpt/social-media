import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/user";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<null | any> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await connectToDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("User not found!");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                // Return full user object
                return {
                    _id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    // postIds: user.postIds.map(id => id.toString()),
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.username = user.username;
                token.email = user.email;
                token.avatar = user.avatar;
                // token.postIds = user.postIds;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.avatar = token.avatar;
                // session.user.postIds = token.postIds;
            }
            return session;
        }
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET
};
