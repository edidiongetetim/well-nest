
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PostHashtagManagerProps {
  hashtags: string[];
  setHashtags: (hashtags: string[]) => void;
  hashtagInput: string;
  setHashtagInput: (input: string) => void;
}

const hashtagColors = [
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-green-50 text-green-700 border-green-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

export function PostHashtagManager({ 
  hashtags, 
  setHashtags, 
  hashtagInput, 
  setHashtagInput 
}: PostHashtagManagerProps) {
  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <Badge 
              key={tag} 
              className={`${hashtagColors[index % hashtagColors.length]} border rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2`}
            >
              <span>#{tag}</span>
              <button 
                onClick={() => removeHashtag(tag)} 
                className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
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
          onKeyPress={handleKeyPress}
          className="flex-1 text-base border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
          style={{ fontSize: '16px' }}
        />
        <Button 
          onClick={handleAddHashtag}
          className="bg-[#6A1B9A] text-white font-semibold hover:bg-[#5A137A] active:bg-[#4A0E5F] transition-all duration-200 px-4 py-2 rounded-3xl text-sm"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
