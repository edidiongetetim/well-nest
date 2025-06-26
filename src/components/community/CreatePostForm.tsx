
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export function CreatePostForm({ title, setTitle, content, setContent }: CreatePostFormProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src="/placeholder.svg" alt="Your avatar" />
        <AvatarFallback className="bg-purple-100 text-purple-600">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-6">
        <Input
          placeholder="Add a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-200 bg-white/80 font-poppins text-base placeholder:text-gray-400 rounded-lg focus:border-purple-300 focus:ring-purple-200"
          style={{ fontSize: '16px' }}
        />
        
        <Textarea
          placeholder="What's on your mind today? Share your thoughts, experiences, or ask for support..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-200 bg-white/80 resize-none font-poppins placeholder:text-gray-400 rounded-lg focus:border-purple-300 focus:ring-purple-200"
          style={{ 
            fontSize: '16px',
            minHeight: '100px'
          }}
        />
      </div>
    </div>
  );
}
