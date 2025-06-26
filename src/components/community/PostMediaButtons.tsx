
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, Link2 } from "lucide-react";

interface PostMediaButtonsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function PostMediaButtons({ onSubmit, isSubmitting }: PostMediaButtonsProps) {
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
          onClick={onSubmit}
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
    </>
  );
}
