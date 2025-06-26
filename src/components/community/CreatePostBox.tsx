
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Video, Mic, Link2, Hash, Globe, Users, EyeOff, UserX, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatePostBoxProps {
  onPostCreated: () => void;
}

const moods = [
  { value: "excited", label: "😊 Excited", color: "bg-yellow-100 text-yellow-800" },
  { value: "grateful", label: "🙏 Grateful", color: "bg-green-100 text-green-800" },
  { value: "worried", label: "😟 Worried", color: "bg-orange-100 text-orange-800" },
  { value: "happy", label: "😄 Happy", color: "bg-blue-100 text-blue-800" },
  { value: "tired", label: "😴 Tired", color: "bg-gray-100 text-gray-800" },
  { value: "hopeful", label: "🌟 Hopeful", color: "bg-purple-100 text-purple-800" },
];

const visibilityOptions = [
  { value: "public", label: "Public", icon: Globe, description: "Everyone can see this post" },
  { value: "followers", label: "Followers Only", icon: Users, description: "Only your followers can see this" },
  { value: "anonymous", label: "Anonymous", icon: EyeOff, description: "Post anonymously" },
  { value: "private", label: "Private", icon: UserX, description: "Only you can see this" },
];

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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim() && !title.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return;
      }

      const postData = {
        user_id: user.id,
        title: title || "Community Post",
        content: content,
        mood: mood || null,
        visibility: visibility,
        is_anonymous: visibility === "anonymous",
        hashtags: hashtags.length > 0 ? hashtags : null,
        link_url: linkUrl || null,
        link_title: linkTitle || null,
      };

      const { error } = await supabase
        .from("posts")
        .insert([postData]);

      if (error) throw error;

      // Clear form
      setContent("");
      setTitle("");
      setMood("");
      setVisibility("public");
      setHashtags([]);
      setLinkUrl("");
      setLinkTitle("");
      setShowLinkInput(false);

      toast({
        title: "Success!",
        description: "Your post has been created",
      });

      onPostCreated();
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

  const selectedMood = moods.find(m => m.value === mood);
  const selectedVisibility = visibilityOptions.find(v => v.value === visibility);

  return (
    <Card className="mb-6 bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/placeholder.svg" alt="Your avatar" />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              You
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Input
              placeholder="Add a title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 bg-gray-50 font-poppins text-lg placeholder:text-gray-400"
            />
            
            <Textarea
              placeholder="What's on your mind today? Share your thoughts, experiences, or ask for support..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-0 bg-gray-50 resize-none font-poppins placeholder:text-gray-400 min-h-[100px]"
            />

            {/* Hashtags */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700">
                    #{tag}
                    <button onClick={() => removeHashtag(tag)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add hashtag..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                  className="flex-1 h-8 text-sm"
                />
                <Button size="sm" onClick={handleAddHashtag} disabled={!hashtagInput.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {/* Link Input */}
            {showLinkInput && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Link URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Link title (optional)"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkInput(false)}
                >
                  Remove Link
                </Button>
              </div>
            )}

            {/* Mood and Visibility Selection */}
            <div className="flex gap-4">
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((moodOption) => (
                    <SelectItem key={moodOption.value} value={moodOption.value}>
                      {moodOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected mood and visibility display */}
            <div className="flex gap-2">
              {selectedMood && (
                <Badge className={selectedMood.color}>
                  {selectedMood.label}
                </Badge>
              )}
              {selectedVisibility && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <selectedVisibility.icon className="w-3 h-3" />
                  {selectedVisibility.label}
                </Badge>
              )}
            </div>

            {/* Media buttons and Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-purple-600"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-purple-600"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-purple-600"
                  onClick={() => audioInputRef.current?.click()}
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Audio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-purple-600"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                >
                  <Link2 className="w-4 h-4 mr-1" />
                  Link
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && !title.trim())}
                className="bg-purple-600 hover:bg-purple-700 text-white font-poppins"
              >
                {isSubmitting ? "Posting..." : "Share Post"}
              </Button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                // TODO: Handle image upload
                console.log("Image selected:", e.target.files?.[0]);
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                // TODO: Handle video upload
                console.log("Video selected:", e.target.files?.[0]);
              }}
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                // TODO: Handle audio upload
                console.log("Audio selected:", e.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
