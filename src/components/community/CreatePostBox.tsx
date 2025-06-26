
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

const hashtagColors = [
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-green-50 text-green-700 border-green-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
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
    // For now, this is disabled - just show a toast
    toast({
      title: "Coming Soon!",
      description: "Post creation will be available in the next update.",
    });
  };

  const selectedMood = moods.find(m => m.value === mood);
  const selectedVisibility = visibilityOptions.find(v => v.value === visibility);

  return (
    <Card className="mb-8 bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
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

            {/* Hashtags */}
            <div className="space-y-4">
              {hashtags.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {hashtags.map((tag, index) => (
                    <Badge 
                      key={tag} 
                      className={`${hashtagColors[index % hashtagColors.length]} border rounded-full px-3 py-2 text-sm font-medium flex items-center justify-between`}
                    >
                      <span>#{tag}</span>
                      <button 
                        onClick={() => removeHashtag(tag)} 
                        className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Add hashtag..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                  className="flex-1 h-9 text-sm"
                  disabled
                />
                <Button size="sm" onClick={handleAddHashtag} disabled>
                  Add
                </Button>
              </div>
            </div>

            {/* Link Input */}
            {showLinkInput && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <Input
                  placeholder="Link URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="text-sm"
                  disabled
                />
                <Input
                  placeholder="Link title (optional)"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="text-sm"
                  disabled
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkInput(false)}
                  disabled
                >
                  Remove Link
                </Button>
              </div>
            )}

            {/* Mood and Visibility Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={mood} onValueChange={setMood} disabled>
                <SelectTrigger className="w-full sm:w-48">
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

              <Select value={visibility} onValueChange={setVisibility} disabled>
                <SelectTrigger className="w-full sm:w-48">
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
            {(selectedMood || selectedVisibility) && (
              <div className="flex flex-wrap gap-2">
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
            )}

            {/* Media buttons and Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Audio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Link2 className="w-4 h-4 mr-1" />
                  Link
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed font-poppins"
              >
                Share Post
              </Button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
