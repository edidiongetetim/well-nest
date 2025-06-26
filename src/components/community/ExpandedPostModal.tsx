
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CreatePostForm } from "./CreatePostForm";
import { PostHashtagManager } from "./PostHashtagManager";
import { PostVisibilitySelector } from "./PostVisibilitySelector";
import { PostLinkInput } from "./PostLinkInput";
import { PostMediaButtons } from "./PostMediaButtons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ExpandedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function ExpandedPostModal({ isOpen, onClose, onPostCreated }: ExpandedPostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [mood, setMood] = useState("excited");
  const [visibility, setVisibility] = useState("public");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title: title.trim() || null,
        content: content.trim(),
        hashtags: hashtags.length > 0 ? hashtags : null,
        mood,
        visibility,
        link_url: linkUrl.trim() || null,
        link_title: linkTitle.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community.",
      });

      // Reset form
      setTitle("");
      setContent("");
      setHashtags([]);
      setHashtagInput("");
      setMood("excited");
      setVisibility("public");
      setLinkUrl("");
      setLinkTitle("");
      setShowLinkInput(false);

      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 border-0 max-w-[560px] w-[90%] sm:w-full"
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div className="relative p-6 sm:p-8 space-y-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-xl text-gray-900">
              Create Post
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full h-8 w-8 p-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Form */}
          <div className="space-y-6">
            <CreatePostForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />

            {/* Link Input */}
            <PostLinkInput
              showLinkInput={showLinkInput}
              setShowLinkInput={setShowLinkInput}
              linkUrl={linkUrl}
              setLinkUrl={setLinkUrl}
              linkTitle={linkTitle}
              setLinkTitle={setLinkTitle}
            />

            {/* Hashtags */}
            <PostHashtagManager
              hashtags={hashtags}
              setHashtags={setHashtags}
              hashtagInput={hashtagInput}
              setHashtagInput={setHashtagInput}
            />

            {/* Visibility and Mood */}
            <PostVisibilitySelector
              mood={mood}
              setMood={setMood}
              visibility={visibility}
              setVisibility={setVisibility}
            />

            {/* Media Buttons */}
            <PostMediaButtons
              onSubmit={() => {}}
              isSubmitting={isSubmitting}
              showLinkInput={showLinkInput}
              setShowLinkInput={setShowLinkInput}
            />
          </div>

          {/* Post Button - Centered */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#6A1B9A] text-white font-semibold hover:bg-[#5A137A] active:bg-[#4A0E5F] transition-all duration-200 text-base px-8 py-3 rounded-3xl shadow-sm"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
