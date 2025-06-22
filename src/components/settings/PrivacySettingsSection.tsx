
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrivacySettingsSectionProps {
  profileVisibility: boolean;
  setProfileVisibility: (value: boolean) => void;
  pregnancyTracking: boolean;
  setPregnancyTracking: (value: boolean) => void;
  dataConsent: boolean;
  setDataConsent: (value: boolean) => void;
}

export const PrivacySettingsSection = ({
  profileVisibility,
  setProfileVisibility,
  pregnancyTracking,
  setPregnancyTracking,
  dataConsent,
  setDataConsent
}: PrivacySettingsSectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardTitle className="font-poppins text-xl text-primary">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Show Profile in Community</Label>
              <p className="font-poppins text-sm text-gray-600">
                Allow other community members to see your profile and interact with your posts
              </p>
            </div>
            <Switch
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Pregnancy Tracking Visibility</Label>
              <p className="font-poppins text-sm text-gray-600">
                Show pregnancy milestones and progress to support providers
              </p>
            </div>
            <Switch
              checked={pregnancyTracking}
              onCheckedChange={setPregnancyTracking}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Data Usage Consent</Label>
              <p className="font-poppins text-sm text-gray-600">
                Allow WellNest to use anonymized data to improve our services
              </p>
            </div>
            <Switch
              checked={dataConsent}
              onCheckedChange={setDataConsent}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-poppins text-sm text-blue-800">
            <span className="font-medium">Privacy Notice:</span> Your personal health information is always kept private and secure. We never share identifiable data with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
