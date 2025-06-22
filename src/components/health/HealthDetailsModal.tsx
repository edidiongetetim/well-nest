
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'Not recorded';
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    if (!riskLevel) return "text-gray-500";
    const level = riskLevel.toLowerCase();
    if (level.includes('low')) return 'text-green-600';
    if (level.includes('moderate')) return 'text-yellow-600';
    if (level.includes('high')) return 'text-red-500';
    return 'text-gray-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-xl text-primary">
            {type === 'physical' ? 'Physical Health' : 'Mental Health'} Check-In Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-poppins font-semibold text-gray-800 mb-2">
              Check-In Date
            </h3>
            <p className="font-poppins text-gray-600">
              {format(new Date(data.created_at), 'MMMM dd, yyyy • h:mm a')}
            </p>
          </div>

          {type === 'physical' ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-2">Age</h4>
                  <p className="font-poppins text-blue-700">{formatValue('age', data.age)} years</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-2">Heart Rate</h4>
                  <p className="font-poppins text-blue-700">{formatValue('heartbeat', data.heartbeat)} bpm</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-2">Systolic Pressure</h4>
                  <p className="font-poppins text-blue-700">{formatValue('systolic', data.systolic)} mmHg</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-2">Diastolic Pressure</h4>
                  <p className="font-poppins text-blue-700">{formatValue('diastolic', data.diastolic)} mmHg</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-poppins font-semibold text-blue-800 mb-2">Blood Pressure</h4>
                <p className="font-poppins text-blue-700">{formatValue('blood_pressure', data.blood_pressure)} mmHg</p>
              </div>

              {/* Health Risk Assessment */}
              {(data.prediction_result || data.risk_level) && (
                <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-4 rounded-lg border">
                  <h4 className="font-poppins font-semibold text-purple-800 mb-2">Health Risk Assessment</h4>
                  <p className={`font-poppins text-lg font-semibold ${getRiskLevelColor(data.risk_level || data.prediction_result)}`}>
                    {data.prediction_result || data.risk_level}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-poppins font-semibold text-purple-800 mb-2">EPDS Score</h4>
                <p className="font-poppins text-purple-700">
                  {data.epds_score !== null ? data.epds_score : 'Not calculated'}
                </p>
              </div>

              {/* Risk Level */}
              {data.risk_level && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-purple-800 mb-2">Risk Level</h4>
                  <p className={`font-poppins text-lg font-semibold ${getRiskLevelColor(data.risk_level)}`}>
                    {data.risk_level}
                  </p>
                </div>
              )}
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-poppins font-semibold text-purple-800 mb-2">Survey Responses</h4>
                <div className="space-y-2">
                  {data.responses && typeof data.responses === 'object' ? (
                    Object.entries(data.responses).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-poppins text-purple-600 capitalize">{key}:</span>
                        <span className="font-poppins text-purple-700">{formatValue(key, value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="font-poppins text-purple-600">No response data available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
