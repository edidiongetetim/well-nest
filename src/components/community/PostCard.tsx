
import { Card, CardContent } from "@/components/ui/card";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostReactions } from "./PostReactions";
import { Post, Reaction } from "./types";

interface PostCardProps {
  post: Post;
  postReactions: Reaction[];
  isSaved: boolean;
  onReaction: (postId: string, reactionType: string) => void;
  onSave: (postId: string) => void;
}

export function PostCard({ post, postReactions, isSaved, onReaction, onSave }: PostCardProps) {
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

  return (
    <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <PostHeader post={post} timeAgo={formatTimeAgo(post.created_at)} />
        <PostContent post={post} />
        <PostReactions 
          post={post}
          postReactions={postReactions}
          isSaved={isSaved}
          onReaction={onReaction}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
}
