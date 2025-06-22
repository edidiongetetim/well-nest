
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface HealthDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  type: 'physical' | 'mental';
}

export const HealthDetailsModal = ({
  open,
  onOpenChange,
  data,
  type
}: HealthDetailsModalProps) => {
  if (!data) return null;

  const formattedDate = format(new Date(data.created_at), 'MMMM dd, yyyy • h:mm a');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-xl text-primary">
            {type === 'physical' ? 'Physical Health Check-In' : 'Mental Health Check-In'} Details
          </DialogTitle>
          <p className="font-poppins text-gray-500">{formattedDate}</p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {type === 'physical' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800 mb-2">Age</h3>
                  <p className="font-poppins text-gray-600">{data.age}</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800 mb-2">Systolic</h3>
                  <p className="font-poppins text-gray-600">{data.systolic} mmHg</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800 mb-2">Diastolic</h3>
                  <p className="font-poppins text-gray-600">{data.diastolic} mmHg</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800 mb-2">Heart Rate</h3>
                  <p className="font-poppins text-gray-600">{data.heartbeat} bpm</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800 mb-2">Blood Pressure</h3>
                  <p className="font-poppins text-gray-600">{data.blood_pressure} mmHg</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-poppins font-semibold text-gray-800 mb-2">EPDS Score</h3>
                <p className="font-poppins text-2xl font-bold text-purple-600">
                  {data.epds_score || 'Not calculated'}
                </p>
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-800 mb-4">Survey Responses</h3>
                <div className="space-y-3">
                  {data.responses && Object.entries(data.responses).map(([key, value], index) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-poppins text-sm text-gray-600">Question {index + 1}</p>
                      <p className="font-poppins text-gray-800">Response: {value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-6 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            className="font-poppins"
            style={{
              background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
              border: 'none',
              color: '#5B3673'
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
