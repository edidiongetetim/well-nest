
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Eye } from "lucide-react";
import { Post, Reaction, reactionEmojis } from "./types";

interface PostReactionsProps {
  post: Post;
  postReactions: Reaction[];
  isSaved: boolean;
  onReaction: (postId: string, reactionType: string) => void;
  onSave: (postId: string) => void;
}

export function PostReactions({ post, postReactions, isSaved, onReaction, onSave }: PostReactionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex items-center gap-1">
        {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => {
          const hasReacted = postReactions.some(r => r.reaction_type === type);
          return (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => onReaction(post.id, type)}
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
          onClick={() => onSave(post.id)}
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
  );
}
