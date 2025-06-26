
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
    pregnancy_weeks?: number;
    pronouns?: string;
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

// Placeholder posts data
const placeholderPosts: Post[] = [
  {
    id: "1",
    user_id: "user-1",
    title: "First Kicks!",
    content: "Just felt the baby kick for the first time! Such an amazing feeling. Can't wait to meet our little one. 💕",
    image_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
    mood: "excited",
    hashtags: ["FirstKicks", "PregnancyJourney"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 24,
    comments_count: 8,
    shares_count: 2,
    saves_count: 5,
    views_count: 156,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    profiles: {
      first_name: "Sarah",
      last_name: "Johnson",
      avatar_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face",
      pregnancy_weeks: 16,
    }
  },
  {
    id: "2",
    user_id: "user-2",
    title: "Sleep Struggles",
    content: "Is anyone else struggling with sleep lately? 😅 Tips welcome!",
    mood: "tired",
    hashtags: ["SleepHelp", "PregnancyTips"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 13,
    comments_count: 4,
    shares_count: 1,
    saves_count: 3,
    views_count: 89,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    profiles: {
      first_name: "Chloe",
      last_name: "Adebayo",
      avatar_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=150&fit=crop&crop=face",
      pregnancy_weeks: 22,
    }
  },
  {
    id: "3",
    user_id: "user-3",
    title: "Daily Reminder",
    content: "Reminder: Your body is amazing. Rest is productive. 🌸",
    mood: "hopeful",
    hashtags: ["SelfCare", "PositiveVibes"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 39,
    comments_count: 12,
    shares_count: 8,
    saves_count: 15,
    views_count: 234,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    profiles: {
      first_name: "T.K.",
      last_name: "",
      avatar_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=150&h=150&fit=crop&crop=face",
      pregnancy_weeks: 18,
    }
  },
  {
    id: "4",
    user_id: "user-4",
    title: "Meditation Success",
    content: "This meditation in the wellness tab actually helped me calm down today. Highly recommend.",
    link_url: "https://wellnest.app/mental",
    link_title: "WellNest Mental Wellness",
    mood: "grateful",
    hashtags: ["Meditation", "MentalHealth"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 17,
    comments_count: 3,
    shares_count: 2,
    saves_count: 8,
    views_count: 98,
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    profiles: {
      first_name: "Ava",
      last_name: "Chen",
      avatar_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face",
      pregnancy_weeks: 10,
    }
  },
  {
    id: "5",
    user_id: "user-5",
    title: "Inclusive Space",
    content: "As a non-binary parent-to-be, I really appreciate how inclusive this platform is. Thank you for seeing us. ✨",
    mood: "grateful",
    hashtags: ["Inclusion", "NonBinary", "Community"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 45,
    comments_count: 11,
    shares_count: 6,
    saves_count: 12,
    views_count: 289,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    profiles: {
      first_name: "Jordan",
      last_name: "Ali",
      avatar_url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=150&h=150&fit=crop&crop=face",
      pregnancy_weeks: 9,
      pronouns: "they/them",
    }
  },
  {
    id: "6",
    user_id: "user-6",
    title: "Partner Support",
    content: "My partner is glowing and nesting hard — we've rearranged the living room twice this week! 😂",
    mood: "happy",
    hashtags: ["PartnerSupport", "Nesting"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 19,
    comments_count: 3,
    shares_count: 1,
    saves_count: 4,
    views_count: 76,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    profiles: {
      first_name: "Luis",
      last_name: "Hernandez",
      pregnancy_weeks: 14,
    }
  },
  {
    id: "7",
    user_id: "user-7",
    title: "Prenatal Yoga",
    content: "Just had a prenatal yoga session. Felt incredible after a long day. Highly recommend! 🧘🏾‍♀️",
    mood: "happy",
    hashtags: ["PrenatalYoga", "SelfCare"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 33,
    comments_count: 6,
    shares_count: 4,
    saves_count: 10,
    views_count: 134,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    profiles: {
      first_name: "Anika",
      last_name: "Patel",
      pregnancy_weeks: 27,
    }
  },
  {
    id: "8",
    user_id: "user-8",
    title: "App Features",
    content: "Started using the reminders feature for supplements and water intake. Game changer 💧",
    link_url: "https://wellnest.app/health",
    link_title: "WellNest Health Tracking",
    mood: "grateful",
    hashtags: ["HealthTracking", "Reminders"],
    visibility: "public",
    is_anonymous: false,
    likes_count: 21,
    comments_count: 2,
    shares_count: 3,
    saves_count: 7,
    views_count: 91,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    profiles: {
      first_name: "Bisi",
      last_name: "Okonkwo",
      pregnancy_weeks: 12,
    }
  }
];

export function EnhancedCommunityFeed({ feedType, refreshTrigger }: EnhancedCommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [loading, setLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, Reaction[]>>({});
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPosts = async () => {
    // For now, we'll use placeholder data
    // In the future, this will fetch from Supabase based on feedType
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredPosts = [...placeholderPosts];
      
      // Simple filtering based on feedType
      if (feedType === "new") {
        filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (feedType === "suggested") {
        // For suggested, we could add logic based on user preferences
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
    // Placeholder reaction handling
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getUserDisplayName = (post: Post) => {
    if (post.is_anonymous) return "Anonymous";
    if (post.profiles?.first_name || post.profiles?.last_name) {
      const name = `${post.profiles.first_name || ""} ${post.profiles.last_name || ""}`.trim();
      const weeks = post.profiles.pregnancy_weeks ? ` • ${post.profiles.pregnancy_weeks} weeks` : "";
      const pronouns = post.profiles.pronouns ? ` (${post.profiles.pronouns})` : "";
      return `${name}${pronouns}${weeks}`;
    }
    return "Community Member";
  };

  const getAvatarFallback = (post: Post) => {
    if (post.is_anonymous) return "A";
    const firstName = post.profiles?.first_name || "C";
    const lastName = post.profiles?.last_name || "M";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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
            <Card key={post.id} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* User header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} alt={getUserDisplayName(post)} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-medium">
                        {getAvatarFallback(post)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-poppins font-medium text-gray-900">{getUserDisplayName(post)}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-poppins text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                        {post.mood && (
                          <Badge className={`text-xs px-2 py-1 ${moodColors[post.mood as keyof typeof moodColors] || 'bg-gray-100 text-gray-800'}`}>
                            {post.mood}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post content */}
                <div className="mb-4">
                  {post.title !== "Community Post" && (
                    <h2 className="font-poppins font-semibold text-lg mb-2 text-gray-900">{post.title}</h2>
                  )}
                  <p className="font-poppins text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </div>

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-50 text-purple-600 hover:bg-purple-100 cursor-pointer transition-colors px-3 py-1 rounded-full"
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
                  <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
                          className={`text-xs h-8 px-2 ${hasReacted ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'} transition-colors`}
                        >
                          <span className="mr-1">{emoji}</span>
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleSave(post.id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${isSaved ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{post.saves_count}</span>
                    </button>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500">
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
