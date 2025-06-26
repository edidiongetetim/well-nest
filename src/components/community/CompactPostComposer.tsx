
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { ExpandedPostModal } from "./ExpandedPostModal";

interface CompactPostComposerProps {
  onPostCreated: () => void;
}

export function CompactPostComposer({ onPostCreated }: CompactPostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" alt="Your avatar" />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="bg-gray-50 rounded-full px-4 py-3 text-gray-500 font-poppins">
              What's on your mind?
            </div>
          </div>
        </div>
      </div>

      <ExpandedPostModal 
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        onPostCreated={onPostCreated}
      />
    </>
  );
}
