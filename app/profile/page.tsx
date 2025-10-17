"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import ImageKit from "imagekit-javascript";
import Link from "next/link";
import { UploadResult } from "../components/CreatePost";

const Profile = () => {
  const { data: session } = useSession();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [auth, setAuth] = useState<any>(null);

  const user = session?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill with current user data
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch ImageKit auth
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await fetch("/api/auth/imagekit-auth");
        const data = await res.json();
        setAuth(data);
      } catch (err) {
        console.error("Failed to fetch ImageKit auth:", err);
      }
    };
    fetchAuth();
  }, []);

  if (!user) return null;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      let avatarUrl = profileData.avatar; // default to existing avatar

      // Upload new avatar if selected
      if (profilePicture && auth) {
        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        const uploadResult: UploadResult = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: profilePicture,
              fileName: profilePicture.name,
              folder: "/users",
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

        avatarUrl = uploadResult.url;
      }

      // Prepare data to send, keeping unchanged fields as-is
      const userData = {
        userId: user._id,
        username: profileData.username,
        email: profileData.email,
        avatar: avatarUrl,
      };

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      // Update local state immediately
      setProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
      setPreview(null);
      setProfilePicture(null);
      setSuccess(true);

      // Refresh NextAuth session so useSession() gets the latest data
      await signIn("credentials", { redirect: false });
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={"/"}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-medium">Edit Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a new profile picture. Recommended size is 400x400px.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={preview || profileData.avatar} />
                  <AvatarFallback>
                    {user.username
                      ? user.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm">
                    ✅ Profile updated successfully!
                  </p>
                )}

                <Button type="submit" className="gap-2" disabled={uploading}>
                  <Save className="w-4 h-4" />
                  {uploading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
