
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = async () => {
    // For now, this is disabled - just show a toast
    toast({
      title: "Coming Soon!",
      description: "Post creation will be available in the next update.",
    });
  };

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
          />
        </div>
      </CardContent>
    </Card>
  );
}
