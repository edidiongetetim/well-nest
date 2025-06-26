
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostLinkInputProps {
  showLinkInput: boolean;
  setShowLinkInput: (show: boolean) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkTitle: string;
  setLinkTitle: (title: string) => void;
}

export function PostLinkInput({
  showLinkInput,
  setShowLinkInput,
  linkUrl,
  setLinkUrl,
  linkTitle,
  setLinkTitle
}: PostLinkInputProps) {
  if (!showLinkInput) return null;

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
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
  );
}
