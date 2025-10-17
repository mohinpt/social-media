// import { DefaultSession } from "next-auth";

// declare module "next-auth"{
//     interface Session{
//         user: {
//             id: String,
//             name?: string | null;
//         } & DefaultSession["user"]
//     }
// }


// import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//     interface Session {
//         user: {
//             _id: string;
//             username: string;
//             avatar: string;
//         } & DefaultSession["user"];
//     }

//     interface User extends DefaultUser {
//         _id: string;
//         username: string;
//         avatar: string;
//         postIds: string[];
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         _id: string;
//         username: string;
//         avatar: string;
//     }
// }



// next-auth.d.ts
import NextAuth, { DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session.user object to include custom properties
   */
  interface Session {
    user: {
      _id: string;
      username: string;
      avatar: string;
    } & DefaultSession["user"]; // Includes id, name, email, image
  }

  /**
   * Extends the built-in User model to include custom properties
   */
  interface User extends DefaultUser {
    _id: string;
    username: string;
    avatar: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT token to include custom properties
   */
  interface JWT {
    _id: string;
    username: string;
    avatar: string;
  }
}