
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "./PostCard";
import { Post, Reaction } from "./types";
import { placeholderPosts } from "./placeholderData";

interface EnhancedCommunityFeedProps {
  feedType: "suggested" | "following" | "new";
  refreshTrigger?: number;
}

export function EnhancedCommunityFeed({ feedType, refreshTrigger }: EnhancedCommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [loading, setLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, Reaction[]>>({});
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredPosts = [...placeholderPosts];
      
      // Simple filtering based on feedType
      if (feedType === "new") {
        filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (feedType === "suggested") {
        filteredPosts = filteredPosts.filter(post => post.likes_count > 15);
      }
      
      setPosts(filteredPosts);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, refreshTrigger]);

  const handleReaction = async (postId: string, reactionType: string) => {
    const existingReaction = userReactions[postId]?.find(r => r.reaction_type === reactionType);
    
    if (existingReaction) {
      // Remove reaction
      setUserReactions(prev => ({
        ...prev,
        [postId]: prev[postId]?.filter(r => r.id !== existingReaction.id) || []
      }));
    } else {
      // Add reaction
      const newReaction = {
        id: `reaction-${Date.now()}`,
        reaction_type: reactionType,
        user_id: "current-user"
      };
      
      setUserReactions(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newReaction]
      }));
    }
  };

  const handleSave = async (postId: string) => {
    if (userSaves.has(postId)) {
      setUserSaves(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setUserSaves(prev => new Set([...prev, postId]));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
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
            <PostCard
              key={post.id}
              post={post}
              postReactions={postReactions}
              isSaved={isSaved}
              onReaction={handleReaction}
              onSave={handleSave}
            />
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
