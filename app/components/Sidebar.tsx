import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { TrendingUp, Users } from "lucide-react"

const trendingTopics = [
    { topic: "#ReactJS", posts: "45.2K posts" },
    { topic: "#WebDev", posts: "32.1K posts" },
    { topic: "#NextJS", posts: "28.7K posts" },
    { topic: "#TypeScript", posts: "19.5K posts" },
    { topic: "#TailwindCSS", posts: "15.3K posts" },
]

const suggestedUsers = [
    {
        id: "1",
        name: "MoHin",
        username: "mohin",
        avatar: "https://images.unsplash.com/vector-1744109949679-9504cd8f6719?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        isFollowing: false
    },
    {
        id: "2",
        name: "Siam",
        username: "siam",
        avatar: "https://plus.unsplash.com/premium_vector-1721131162476-9dcc47328755?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        isFollowing: false
    },
    {
        id: "3",
        name: "RaHi",
        username: "therahi",
        avatar: "https://images.unsplash.com/vector-1757389589707-1ba9d8ce956d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxhY2slMjB3aGl0ZSUyMHByb2ZpbGUlMjBwaWMlMjBsaXR0bGUlMjBnaXJsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        isFollowing: false
    }
]

export function Sidebar() {
    return (
        <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Trending</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {trendingTopics.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md cursor-pointer">
                            <div>
                                <p className="font-medium">{trend.topic}</p>
                                <p className="text-sm text-muted-foreground">{trend.posts}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                #{index + 1}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Who to follow</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {suggestedUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                            </div>
                            <Button size="sm" variant={user.isFollowing ? "secondary" : "default"}>
                                {user.isFollowing ? "Following" : "Follow"}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}