
export interface Post {
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

export interface Reaction {
  id: string;
  reaction_type: string;
  user_id: string;
}

export const reactionEmojis = {
  relate: { emoji: "💞", label: "Relate" },
  support: { emoji: "👏", label: "Support" },
  curious: { emoji: "🤔", label: "Curious" },
  inspired: { emoji: "🙌", label: "Inspired" },
  like: { emoji: "❤️", label: "Like" },
};

export const moodColors = {
  excited: "bg-yellow-100 text-yellow-800",
  grateful: "bg-green-100 text-green-800",
  worried: "bg-orange-100 text-orange-800",
  happy: "bg-blue-100 text-blue-800",
  tired: "bg-gray-100 text-gray-800",
  hopeful: "bg-purple-100 text-purple-800",
};
