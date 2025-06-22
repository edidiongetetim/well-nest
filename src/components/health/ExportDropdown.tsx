
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table } from "lucide-react";
import { exportRecordAsPDF, exportRecordAsCSV, HealthRecord } from "@/utils/exportUtils";

interface ExportDropdownProps {
  record: HealthRecord;
  onExport: () => void;
}

export const ExportDropdown = ({ record, onExport }: ExportDropdownProps) => {
  const handlePDFExport = () => {
    exportRecordAsPDF(record);
    onExport();
  };

  const handleCSVExport = () => {
    exportRecordAsCSV(record);
    onExport();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600"
        >
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePDFExport}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCSVExport}>
          <Table className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
