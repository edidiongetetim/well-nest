
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, Link2 } from "lucide-react";

interface PostMediaButtonsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  showLinkInput: boolean;
  setShowLinkInput: (show: boolean) => void;
}

export function PostMediaButtons({ 
  onSubmit, 
  isSubmitting, 
  showLinkInput, 
  setShowLinkInput 
}: PostMediaButtonsProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => imageInputRef.current?.click()}
          >
            <Camera className="w-4 h-4 mr-1" />
            Photo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video className="w-4 h-4 mr-1" />
            Video
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => audioInputRef.current?.click()}
          >
            <Mic className="w-4 h-4 mr-1" />
            Audio
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => setShowLinkInput(!showLinkInput)}
          >
            <Link2 className="w-4 h-4 mr-1" />
            Link
          </Button>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-white font-poppins"
        >
          {isSubmitting ? "Sharing..." : "Share Post"}
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
    </>
  );
}
