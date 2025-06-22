
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataManagementSectionProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export const DataManagementSection = ({
  onExportData,
  onDeleteAccount
}: DataManagementSectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="font-poppins text-xl text-primary">Data Management</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-poppins font-semibold text-gray-800 mb-2">Export Your Data</h3>
            <p className="font-poppins text-sm text-gray-600 mb-4">
              Download a copy of all your personal data, including health check-ins, preferences, and activity history.
            </p>
            <Button
              variant="outline"
              onClick={onExportData}
              className="font-poppins"
            >
              Export My Data
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-poppins font-semibold text-gray-800 mb-2">Delete Account</h3>
            <p className="font-poppins text-sm text-gray-600 mb-4">
              Permanently delete your WellNest account and all associated data. This action cannot be undone.
            </p>
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
