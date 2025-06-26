
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

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  return (
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
  );
}
