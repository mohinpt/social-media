"use client";

import { Sidebar } from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import CreatePost from "./components/CreatePost";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()
  const user = session?.user;
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-4">
          {user && <CreatePost />}
          <PostFeed />
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

