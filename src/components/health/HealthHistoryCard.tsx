
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Trash2, Share2 } from "lucide-react";
import { format } from "date-fns";

interface HealthHistoryCardProps {
  id: string;
  date: string;
  summary: string;
  onViewFull: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  type: 'physical' | 'mental';
}

export const HealthHistoryCard = ({
  id,
  date,
  summary,
  onViewFull,
  onDelete,
  onShare,
  type
}: HealthHistoryCardProps) => {
  const formattedDate = format(new Date(date), 'MMM dd, yyyy • h:mm a');
  
  return (
    <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                type === 'physical' ? 'bg-blue-400' : 'bg-purple-400'
              }`} />
              <span className="font-poppins text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
            <p className="font-poppins text-gray-800 font-medium">
              {summary}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewFull(id)}
              className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(id)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
