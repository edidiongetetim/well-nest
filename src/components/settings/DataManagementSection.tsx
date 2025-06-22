
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { exportAllUserData, downloadUserDataAsJSON } from "@/utils/dataExportUtils";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

interface DataManagementSectionProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export const DataManagementSection = ({
  onExportData,
  onDeleteAccount
}: DataManagementSectionProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const userData = await exportAllUserData();
      
      if (!userData) {
        toast({
          title: "Export failed",
          description: "Unable to export your data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      downloadUserDataAsJSON(userData);
      
      toast({
        title: "Your data is ready for download!",
        description: "A complete backup of your WellNest data has been downloaded.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

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
              Download a complete backup including health check-ins, EPDS assessments, reminders, and profile settings.
            </p>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={isExporting}
              className="font-poppins"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Preparing Export...' : 'Export My Data'}
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
