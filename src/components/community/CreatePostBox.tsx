
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./CreatePostForm";
import { PostHashtagManager } from "./PostHashtagManager";
import { PostLinkInput } from "./PostLinkInput";
import { PostVisibilitySelector } from "./PostVisibilitySelector";
import { PostMediaButtons } from "./PostMediaButtons";

interface CreatePostBoxProps {
  onPostCreated: () => void;
}

export function CreatePostBox({ onPostCreated }: CreatePostBoxProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
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
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: title.trim() || "",
          content: content.trim(),
          mood: mood || null,
          visibility: visibility,
          hashtags: hashtags.length > 0 ? hashtags : null,
          link_url: linkUrl.trim() || null,
          link_title: linkTitle.trim() || null,
          is_anonymous: false,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          saves_count: 0,
          views_count: 0
        });

      if (error) throw error;

      // Reset form
      setContent("");
      setTitle("");
      setMood("");
      setVisibility("public");
      setHashtags([]);
      setHashtagInput("");
      setLinkUrl("");
      setLinkTitle("");
      setShowLinkInput(false);

      toast({
        title: "Post Created!",
        description: "Your post has been shared successfully.",
      });

      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="mb-8 bg-white shadow-sm border border-gray-100">
        <CardContent className="p-6 text-center">
          <p className="font-poppins text-gray-600 mb-4">
            Sign in to share your thoughts and connect with the community
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="space-y-6">
          <CreatePostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
          />

          <PostHashtagManager
            hashtags={hashtags}
            setHashtags={setHashtags}
            hashtagInput={hashtagInput}
            setHashtagInput={setHashtagInput}
          />

          <PostLinkInput
            showLinkInput={showLinkInput}
            setShowLinkInput={setShowLinkInput}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            linkTitle={linkTitle}
            setLinkTitle={setLinkTitle}
          />

          <PostVisibilitySelector
            mood={mood}
            setMood={setMood}
            visibility={visibility}
            setVisibility={setVisibility}
          />

          <PostMediaButtons
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showLinkInput={showLinkInput}
            setShowLinkInput={setShowLinkInput}
          />
        </div>
      </CardContent>
    </Card>
  );
}
