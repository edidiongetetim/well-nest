
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, EyeOff, UserX } from "lucide-react";

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

interface PostVisibilitySelectorProps {
  mood: string;
  setMood: (mood: string) => void;
  visibility: string;
  setVisibility: (visibility: string) => void;
}

export function PostVisibilitySelector({
  mood,
  setMood,
  visibility,
  setVisibility
}: PostVisibilitySelectorProps) {
  const selectedMood = moods.find(m => m.value === mood);
  const selectedVisibility = visibilityOptions.find(v => v.value === visibility);

  return (
    <>
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
    </>
  );
}
