
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
  showLinkInput, 
  setShowLinkInput 
}: PostMediaButtonsProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex justify-center">
        <div className="flex gap-4 sm:gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center gap-1 p-3 rounded-xl"
            onClick={() => imageInputRef.current?.click()}
            title="Add Photo"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Photo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center gap-1 p-3 rounded-xl"
            onClick={() => videoInputRef.current?.click()}
            title="Add Video"
          >
            <Video className="w-5 h-5" />
            <span className="text-xs">Video</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center gap-1 p-3 rounded-xl"
            onClick={() => audioInputRef.current?.click()}
            title="Add Audio"
          >
            <Mic className="w-5 h-5" />
            <span className="text-xs">Audio</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center gap-1 p-3 rounded-xl"
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Add Link"
          >
            <Link2 className="w-5 h-5" />
            <span className="text-xs">Link</span>
          </Button>
        </div>
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
