
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PredictionResponse {
  prediction?: string;
  risk_level?: string;
}

interface HealthFormData {
  age: string;
  systolic: string;
  diastolic: string;
  heartbeat: string;
  bloodSugar: string;
  bodyTemperature: string;
}

interface HealthCheckInModalConfirmationProps {
  formData: HealthFormData;
  predictionResult: PredictionResponse | null;
  onClose: () => void;
  onTakeAgain: () => void;
}

export const HealthCheckInModalConfirmation = ({
  formData,
  predictionResult,
  onClose,
  onTakeAgain
}: HealthCheckInModalConfirmationProps) => {
  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-100 to-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="w-10 h-10 text-teal-600" />
      </div>

      {/* Pregnancy Risk Prediction Result */}
      <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-6 rounded-lg border border-purple-200">
        <h3 className="font-poppins font-semibold text-lg text-primary mb-3">
          Pregnancy Risk Prediction
        </h3>
        <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
          <p className="font-poppins text-2xl font-bold text-purple-700">
            {predictionResult?.prediction || predictionResult?.risk_level || 'Assessment Complete'}
          </p>
        </div>
      </div>

      {/* Submitted Data Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-poppins font-semibold text-lg mb-4" style={{ color: '#5B3673' }}>
          Your Submitted Vitals
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-poppins text-gray-600">Age:</span>
            <span className="font-poppins font-medium ml-2">{formData.age}</span>
          </div>
          <div>
            <span className="font-poppins text-gray-600">Systolic:</span>
            <span className="font-poppins font-medium ml-2">{formData.systolic} mmHg</span>
          </div>
          <div>
            <span className="font-poppins text-gray-600">Diastolic:</span>
            <span className="font-poppins font-medium ml-2">{formData.diastolic} mmHg</span>
          </div>
          <div>
            <span className="font-poppins text-gray-600">Heart Rate:</span>
            <span className="font-poppins font-medium ml-2">{formData.heartbeat} BPM</span>
          </div>
          <div>
            <span className="font-poppins text-gray-600">Blood Sugar:</span>
            <span className="font-poppins font-medium ml-2">{formData.bloodSugar} mmol/L</span>
          </div>
          <div>
            <span className="font-poppins text-gray-600">Body Temperature:</span>
            <span className="font-poppins font-medium ml-2">{formData.bodyTemperature}°F</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-4">
        <Button 
          onClick={onClose}
          className="px-8 py-3 font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
            border: 'none',
            color: '#5B3673'
          }}
        >
          Close
        </Button>
        <Button 
          variant="outline" 
          onClick={onTakeAgain}
          className="px-8 py-3 font-poppins font-medium rounded-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50"
        >
          Take Again
        </Button>
      </div>
    </div>
  );
};
