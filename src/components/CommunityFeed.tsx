
import { useState } from "react";
import { Heart, MessageCircle, Eye, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isFollowing: boolean;
}

// Mock data for different feed types
const mockPosts: Record<string, Post[]> = {
  suggested: [
    {
      id: "1",
      userName: "Sarah Johnson",
      userAvatar: "/placeholder.svg",
      timeAgo: "2h ago",
      content: "Just felt the baby kick for the first time! Such an amazing feeling. Can't wait to meet our little one. 💕",
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=500&h=400&fit=crop",
      likes: 24,
      comments: 8,
      views: 156,
      isLiked: false,
      isFollowing: false,
    },
    {
      id: "2",
      userName: "Emily Chen",
      userAvatar: "/placeholder.svg",
      timeAgo: "4h ago",
      content: "Morning yoga session complete! Staying active during pregnancy has been so important for my mental health.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=400&fit=crop",
      likes: 31,
      comments: 12,
      views: 203,
      isLiked: true,
      isFollowing: false,
    },
    {
      id: "3",
      userName: "Maria Rodriguez",
      userAvatar: "/placeholder.svg",
      timeAgo: "6h ago",
      content: "Family dinner prep with my toddler 'helping' in the kitchen. These moments are everything! 👶🍳",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop",
      likes: 18,
      comments: 5,
      views: 89,
      isLiked: false,
      isFollowing: true,
    },
  ],
  following: [
    {
      id: "4",
      userName: "Maria Rodriguez",
      userAvatar: "/placeholder.svg",
      timeAgo: "1h ago",
      content: "Weekly prenatal appointment went great! Baby is growing perfectly. Feeling so grateful! 🙏",
      likes: 45,
      comments: 15,
      views: 234,
      isLiked: true,
      isFollowing: true,
    },
  ],
  new: [
    {
      id: "5",
      userName: "Jessica Kim",
      userAvatar: "/placeholder.svg",
      timeAgo: "30m ago",
      content: "First time posting here! Just found out we're having a girl. Any advice for a nervous first-time mom? 💕",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=400&fit=crop",
      likes: 12,
      comments: 28,
      views: 67,
      isLiked: false,
      isFollowing: false,
    },
  ],
};

interface CommunityFeedProps {
  feedType: "suggested" | "following" | "new";
}

export function CommunityFeed({ feedType }: CommunityFeedProps) {
  const [posts, setPosts] = useState(mockPosts[feedType] || []);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleFollow = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isFollowing: !post.isFollowing }
          : post
      )
    );
  };

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6">
              {/* User header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.userAvatar} alt={post.userName} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {post.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-poppins font-medium">{post.userName}</h3>
                      {!post.isFollowing && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFollow(post.id)}
                          className="font-poppins text-xs h-6 px-2"
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                    <p className="font-poppins text-sm text-gray-500">{post.timeAgo}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post content */}
              <p className="font-poppins text-gray-700 mb-4">{post.content}</p>

              {/* Post image */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Engagement */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span className="font-poppins text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-poppins text-sm">{post.comments}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="font-poppins text-sm">{post.views}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="font-poppins text-gray-500">
              {feedType === "following" 
                ? "Follow some users to see their posts here!" 
                : "No posts available at the moment."}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
