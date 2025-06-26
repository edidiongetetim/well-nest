
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Post, moodColors } from "./types";

interface PostHeaderProps {
  post: Post;
  timeAgo: string;
}

export function PostHeader({ post, timeAgo }: PostHeaderProps) {
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

  return (
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
            <p className="font-poppins text-sm text-gray-500">{timeAgo}</p>
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
  );
}
