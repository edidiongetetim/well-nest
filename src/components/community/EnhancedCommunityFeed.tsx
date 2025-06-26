
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Eye, MoreHorizontal, ExternalLink, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  link_url?: string;
  link_title?: string;
  hashtags?: string[];
  visibility: string;
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  views_count: number;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

interface Reaction {
  id: string;
  reaction_type: string;
  user_id: string;
}

interface EnhancedCommunityFeedProps {
  feedType: "suggested" | "following" | "new";
  refreshTrigger?: number;
}

const reactionEmojis = {
  relate: { emoji: "💞", label: "Relate" },
  support: { emoji: "👏", label: "Support" },
  curious: { emoji: "🤔", label: "Curious" },
  inspired: { emoji: "🙌", label: "Inspired" },
  like: { emoji: "❤️", label: "Like" },
};

const moodColors = {
  excited: "bg-yellow-100 text-yellow-800",
  grateful: "bg-green-100 text-green-800",
  worried: "bg-orange-100 text-orange-800",
  happy: "bg-blue-100 text-blue-800",
  tired: "bg-gray-100 text-gray-800",
  hopeful: "bg-purple-100 text-purple-800",
};

export function EnhancedCommunityFeed({ feedType, refreshTrigger }: EnhancedCommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReactions, setUserReactions] = useState<Record<string, Reaction[]>>({});
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      // First fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Then fetch profiles for the post authors
      if (postsData && postsData.length > 0) {
        const userIds = postsData.map(post => post.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }

        // Combine posts with profile data
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(profile => profile.id === post.user_id) || null
        }));

        setPosts(postsWithProfiles);
        
        // Fetch user interactions
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await fetchUserInteractions(user.id, postsWithProfiles);
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInteractions = async (userId: string, postList: Post[]) => {
    const postIds = postList.map(p => p.id);
    
    // Fetch reactions
    const { data: reactions } = await supabase
      .from("post_reactions")
      .select("*")
      .eq("user_id", userId)
      .in("post_id", postIds);
    
    // Fetch saves
    const { data: saves } = await supabase
      .from("post_saves")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);

    if (reactions) {
      const reactionsByPost = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.post_id]) acc[reaction.post_id] = [];
        acc[reaction.post_id].push(reaction);
        return acc;
      }, {} as Record<string, Reaction[]>);
      setUserReactions(reactionsByPost);
    }

    if (saves) {
      setUserSaves(new Set(saves.map(s => s.post_id)));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, refreshTrigger]);

  const handleReaction = async (postId: string, reactionType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existingReaction = userReactions[postId]?.find(r => r.reaction_type === reactionType);
    
    try {
      if (existingReaction) {
        // Remove reaction
        await supabase
          .from("post_reactions")
          .delete()
          .eq("id", existingReaction.id);
          
        setUserReactions(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(r => r.id !== existingReaction.id) || []
        }));
      } else {
        // Add reaction
        const { data, error } = await supabase
          .from("post_reactions")
          .insert([{
            user_id: user.id,
            post_id: postId,
            reaction_type: reactionType
          }])
          .select()
          .single();
          
        if (error) throw error;
        
        setUserReactions(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data]
        }));
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (userSaves.has(postId)) {
        // Remove save
        await supabase
          .from("post_saves")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
          
        setUserSaves(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // Add save
        await supabase
          .from("post_saves")
          .insert([{
            user_id: user.id,
            post_id: postId
          }]);
          
        setUserSaves(prev => new Set([...prev, postId]));
      }
    } catch (error) {
      console.error("Error handling save:", error);
      toast({
        title: "Error",
        description: "Failed to update save",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUserDisplayName = (post: Post) => {
    if (post.is_anonymous) return "Anonymous";
    if (post.profiles?.first_name || post.profiles?.last_name) {
      return `${post.profiles.first_name || ""} ${post.profiles.last_name || ""}`.trim();
    }
    return "Community Member";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-6">
        {posts.map((post) => {
          const postReactions = userReactions[post.id] || [];
          const isSaved = userSaves.has(post.id);
          
          return (
            <Card key={post.id} className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-6">
                {/* User header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} alt={getUserDisplayName(post)} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getUserDisplayName(post).split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-poppins font-medium">{getUserDisplayName(post)}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-poppins text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                        {post.mood && (
                          <Badge className={`text-xs ${moodColors[post.mood as keyof typeof moodColors] || 'bg-gray-100 text-gray-800'}`}>
                            {post.mood}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post content */}
                <div className="mb-4">
                  {post.title !== "Community Post" && (
                    <h2 className="font-poppins font-semibold text-lg mb-2">{post.title}</h2>
                  )}
                  <p className="font-poppins text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Media */}
                {post.image_url && (
                  <div className="mb-4">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Link preview */}
                {post.link_url && (
                  <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <ExternalLink className="w-4 h-4" />
                      <a href={post.link_url} target="_blank" rel="noopener noreferrer" className="font-medium">
                        {post.link_title || post.link_url}
                      </a>
                    </div>
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => {
                      const hasReacted = postReactions.some(r => r.reaction_type === type);
                      return (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReaction(post.id, type)}
                          className={`text-xs h-8 ${hasReacted ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
                        >
                          <span className="mr-1">{emoji}</span>
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleSave(post.id)}
                      className={`flex items-center gap-1 text-sm ${isSaved ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{post.saves_count}</span>
                    </button>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{post.views_count}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

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
