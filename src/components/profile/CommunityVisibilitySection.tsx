
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunityVisibilitySectionProps {
  communityVisible: boolean;
  setCommunityVisible: (value: boolean) => void;
}

export const CommunityVisibilitySection = ({
  communityVisible,
  setCommunityVisible
}: CommunityVisibilitySectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
        <CardTitle className="font-poppins text-xl text-primary">Community Visibility</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-poppins font-medium">Show my bio and baby progress on community posts</Label>
            <p className="font-poppins text-sm text-gray-600 mt-1">
              Allow other community members to see your profile information when you post
            </p>
          </div>
          <Switch
            checked={communityVisible}
            onCheckedChange={setCommunityVisible}
          />
        </div>
      </CardContent>
    </Card>
  );
};
