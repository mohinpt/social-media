"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageIcon, Video, X } from "lucide-react";
import { useSession } from "next-auth/react";
import ImageKit from "imagekit-javascript";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

type ImageKitAuth = {
  signature: string;
  token: string;
  expire: number;
};

export type UploadResult = {
  url: string;
  fileId: string;
  name: string;
  fileType: string;
  height?: number;
  width?: number;
};


export default function CreatePost() {
  const { data: session, status } = useSession();

  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [auth, setAuth] = useState<ImageKitAuth | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/auth/imagekit-auth")
        .then((res) => res.ok ? res.json() : Promise.reject("Auth fetch failed"))
        .then((data) => setAuth(data))
        .catch(() => setError("Failed to get upload credentials."));
    }
  }, [status]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setSelectedVideo(null);
      setVideoPreview(null);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedVideo(file);
      setSelectedImage(null);
      setImagePreview(null);
      const reader = new FileReader();
      reader.onload = (e) => setVideoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview(null);
    setVideoPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to create a post");
      return;
    }

    if (!content.trim() && !selectedImage && !selectedVideo) {
      setError("Post cannot be empty");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      let media = null;

      //Upload image or video if selected
      if ((selectedImage || selectedVideo) && auth) {
        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        const file = selectedImage || selectedVideo!;
        const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
          imagekit.upload(
            {
              file,
              fileName: file.name,
              folder: "/posts",
              signature: auth.signature,
              token: auth.token,
              expire: auth.expire,
            },
            (err: Error | null, result: any) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });

        media = {
          type: selectedImage ? "image" : "video",
          url: uploadResult.url,
        };
      }

      // Save post to DB
      const postData = {
        content,
        username: session.user?.username || "anonymous",
        // ...(media && { media }),
        ...(media && { media: { type: media.type as "image" | "video", url: media.url as string } }),
      };

      await apiClient.createPost(postData);

      setSuccess(true);
      setContent("");
      removeMedia();

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to upload or create post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-x-3">
          <div className="flex items-start space-x-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/vector-1744109949679-9504cd8f6719?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" />
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-none shadow-none focus-visible:ring-0 p-0 text-lg placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex-1">
            {/* Media Preview */}
            {(imagePreview || videoPreview) && (
              <div className="mt-3 relative">
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={800}
                      height={600}
                      className="object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeMedia}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {videoPreview && (
                  <div className="relative rounded-lg overflow-hidden">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeMedia}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center space-x-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={!!selectedVideo}
                >
                  <ImageIcon className="w-4 h-4" />
                  Photo
                </Button>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={!!selectedImage}
                >
                  <Video className="w-4 h-4" />
                  Video
                </Button>

              </div>
              <Button
                onClick={handleSubmit}
                disabled={(!content.trim() && !selectedImage && !selectedVideo) || uploading}
                size="sm"
              >
                {uploading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mt-3 p-2 text-sm rounded-md bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 p-2 text-sm rounded-md bg-green-100 text-green-700 border border-green-300">
            Post created successfully!
          </div>
        )}
      </CardContent>
    </Card>
  )
}