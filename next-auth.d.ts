// import { DefaultSession } from "next-auth";

// declare module "next-auth"{
//     interface Session{
//         user: {
//             id: String,
//             name?: string | null;
//         } & DefaultSession["user"]
//     }
// }


import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            username: string;
            avatar: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        _id: string;
        username: string;
        avatar: string;
        postIds: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        username: string;
        avatar: string;
    }
}
