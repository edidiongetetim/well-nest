
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Post } from "./types";

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <>
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
    </>
  );
}
