import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Edit, Trash2, Flag, Link } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"

interface PostProps {
  id?: string
  username: string,
  content: string
  media?: {
    type: "image" | "video";
    url: string;
  } | null;
  timeStamp: string;
  likes: number
  comments: number
  shares: number
  onUpdate?: (id: string, newContent: string) => void
  onRemove?: (id: string) => void
}

export function Post({ id, username, content, media, timeStamp, likes, comments, shares, onUpdate, onRemove }: PostProps) {
  const { data: session } = useSession()
  const user = session?.user;

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Check if current user owns this post
  const isOwner = user?.username === username;
  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              {/* <AvatarImage src={user?.avatar} /> */}
              <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-sm text-muted-foreground">@{username} · {timeStamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isOwner ? (
                <>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Report Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`)
                    //add a toast notification here
                  }}>
                    <Link className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="What's on your mind?"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => {
                  if (id && onUpdate) {
                    onUpdate(id, editContent)
                    setIsEditing(false)
                  }
                }} disabled={!editContent.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <p className="mb-3">{content}</p>
          )}
          {media && (
            <div className="rounded-lg overflow-hidden">
              {media.type == "image" ?
                <Image src={media.url}
                  alt="Post image"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover" />
                :
                <video
                  src={media.url}
                  controls
                  className="w-full h-auto object-cover"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              }
            </div>
          )}
        </div>
        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? "text-red-500 hover:text-red-600" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
            {likeCount}
          </Button>

          <Button variant="ghost" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            {comments}
          </Button>

          <Button variant="ghost" size="sm">
            <Repeat2 className="w-4 h-4 mr-2" />
            {shares}
          </Button>

          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              if (id && onRemove) {
                onRemove(id)
                setShowDeleteDialog(false)
              }
            }}>
              Delete Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}