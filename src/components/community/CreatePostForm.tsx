
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatePostFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export function CreatePostForm({ title, setTitle, content, setContent }: CreatePostFormProps) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src="/placeholder.svg" alt="Your avatar" />
        <AvatarFallback className="bg-purple-100 text-purple-600">
          You
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-6">
        <Input
          placeholder="Add a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 bg-gray-50 font-poppins text-lg placeholder:text-gray-400"
          disabled
        />
        
        <Textarea
          placeholder="What's on your mind today? Share your thoughts, experiences, or ask for support..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-0 bg-gray-50 resize-none font-poppins placeholder:text-gray-400 min-h-[100px]"
          disabled
        />
      </div>
    </div>
  );
}
