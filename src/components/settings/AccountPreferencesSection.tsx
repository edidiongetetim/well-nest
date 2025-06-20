
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountPreferencesSectionProps {
  email: string;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export const AccountPreferencesSection = ({
  email,
  phoneNumber,
  setPhoneNumber,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onExportData,
  onDeleteAccount
}: AccountPreferencesSectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="font-poppins text-xl text-primary">Account Preferences</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-poppins font-medium">Email Address</Label>
          <Input
            id="email"
            value={email}
            readOnly
            className="font-poppins bg-gray-50"
          />
          <p className="font-poppins text-sm text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="font-poppins font-medium">Phone Number (Optional)</Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="font-poppins"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-gray-800">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-poppins font-medium">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="font-poppins"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-poppins font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="font-poppins"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-poppins font-semibold text-gray-800 mb-4">Data Management</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onExportData}
              className="font-poppins"
            >
              Export My Data
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteAccount}
              className="font-poppins"
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
