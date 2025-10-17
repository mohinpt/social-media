"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IPost } from "@/models/post";
import { Post } from "./Post";
import { useSearch } from "@/context/SearchContext";

export default function PostFeed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { query } = useSearch()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = query.trim()
          ? await apiClient.getSearchPosts(query)
          : await apiClient.getPosts();

        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  const handleUpdate = async (id: string, newContent: string) => {
    try {
      await apiClient.updatePost(id, newContent);
      setPosts((prev) =>
        prev.map((p) => (p._id?.toString() === id ? { ...p, content: newContent } : p))
      );
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await apiClient.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id?.toString() !== id));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  }

  if (loading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>

  if (!loading && posts.length === 0) {
    if (query.trim()) {
      // When user searched but no results found
      return (
        <div className="text-center py-4 text-muted-foreground">
          No posts or users found for &quot;<span className="font-medium">{query}</span>&quot;
        </div>
      );
    } else {
      // No posts at all
      return (
        <div className="text-center py-4 text-muted-foreground">
          No posts yet. Be the first to post!
        </div>
      );
    }
  }

  return (
    <div>
      {
        posts.map((post) => (
          <Post
            key={post._id?.toString()}
            id={post._id?.toString()}
            username={post?.username}
            content={post.content}
            media={post?.media}
            timeStamp={new Date(post.createdAt).toLocaleString()}
            likes={post.likesCount}
            comments={post.commentCount}
            shares={post.shareCount}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        ))
      }

    </div>
  );
}