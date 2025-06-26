import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "./PostCard";
import { Post, Reaction } from "./types";
import { placeholderPosts } from "./placeholderData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedCommunityFeedProps {
  feedType: "suggested" | "following" | "new";
  refreshTrigger?: number;
}

export function EnhancedCommunityFeed({ feedType, refreshTrigger }: EnhancedCommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, Reaction[]>>({});
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      // Fetch real posts from Supabase with correct foreign key join
      const { data: realPosts, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          title,
          content,
          mood,
          image_url,
          video_url,
          audio_url,
          link_url,
          link_title,
          hashtags,
          visibility,
          is_anonymous,
          likes_count,
          comments_count,
          shares_count,
          saves_count,
          views_count,
          created_at,
          profiles!posts_user_id_fkey(
            first_name,
            last_name,
            avatar_url,
            phone_number
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        setPosts(placeholderPosts);
      } else {
        // Transform the data to match our Post interface
        const transformedPosts = (realPosts || []).map(post => ({
          ...post,
          profiles: post.profiles ? {
            first_name: post.profiles.first_name,
            last_name: post.profiles.last_name,
            avatar_url: post.profiles.avatar_url,
            pregnancy_weeks: null,
            pronouns: null
          } : null
        }));

        // Combine real posts with placeholder posts
        const combinedPosts = [...transformedPosts, ...placeholderPosts];

        // Simple filtering based on feedType
        let filteredPosts = [...combinedPosts];
        if (feedType === "new") {
          filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (feedType === "suggested") {
          filteredPosts = filteredPosts.filter(post => post.likes_count > 15);
        }
        
        setPosts(filteredPosts);
      }
    } catch (error) {
      console.error('Error:', error);
      setPosts(placeholderPosts);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReactions = async () => {
    if (!user) return;

    try {
      const { data: reactions } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('user_id', user.id);

      if (reactions) {
        const reactionsByPost = reactions.reduce((acc, reaction) => {
          if (!acc[reaction.post_id]) acc[reaction.post_id] = [];
          acc[reaction.post_id].push(reaction);
          return acc;
        }, {} as Record<string, Reaction[]>);
        
        setUserReactions(reactionsByPost);
      }
    } catch (error) {
      console.error('Error fetching user reactions:', error);
    }
  };

  const fetchUserSaves = async () => {
    if (!user) return;

    try {
      const { data: saves } = await supabase
        .from('post_saves')
        .select('post_id')
        .eq('user_id', user.id);

      if (saves) {
        setUserSaves(new Set(saves.map(save => save.post_id)));
      }
    } catch (error) {
      console.error('Error fetching user saves:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserReactions();
      fetchUserSaves();
    }
  }, [feedType, refreshTrigger, user]);

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) return;

    // Skip for placeholder posts
    if (postId.startsWith('placeholder-')) return;

    const existingReaction = userReactions[postId]?.find(r => r.reaction_type === reactionType);
    
    try {
      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (!error) {
          setUserReactions(prev => ({
            ...prev,
            [postId]: prev[postId]?.filter(r => r.id !== existingReaction.id) || []
          }));
        }
      } else {
        // Add reaction
        const { data, error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          })
          .select()
          .single();

        if (!error && data) {
          setUserReactions(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), data]
          }));
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) return;

    // Skip for placeholder posts
    if (postId.startsWith('placeholder-')) return;

    try {
      if (userSaves.has(postId)) {
        // Remove save
        const { error } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (!error) {
          setUserSaves(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      } else {
        // Add save
        const { error } = await supabase
          .from('post_saves')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (!error) {
          setUserSaves(prev => new Set([...prev, postId]));
        }
      }
    } catch (error) {
      console.error('Error handling save:', error);
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
