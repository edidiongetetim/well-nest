
import { Button } from "@/components/ui/button";

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

interface HealthCheckInConfirmationProps {
  formData: HealthFormData;
  predictionResult: PredictionResponse | null;
  onTakeAgain: () => void;
}

export const HealthCheckInConfirmation = ({
  formData,
  predictionResult,
  onTakeAgain
}: HealthCheckInConfirmationProps) => {
  const getSummaryData = () => {
    return {
      age: formData.age,
      systolic: formData.systolic ? `${formData.systolic} mmHg` : '',
      diastolic: formData.diastolic ? `${formData.diastolic} mmHg` : '',
      heartbeat: formData.heartbeat ? `${formData.heartbeat} bpm` : '',
      bloodSugar: formData.bloodSugar ? `${formData.bloodSugar} mmol/L` : '',
      bodyTemperature: formData.bodyTemperature ? `${formData.bodyTemperature}°F` : '',
      riskLevel: predictionResult?.prediction || predictionResult?.risk_level || 'Assessment Complete'
    };
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-100 to-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-poppins font-bold text-2xl text-primary mb-2">
          ✅ Check-In Complete!
        </h1>
        <p className="font-poppins text-lg text-gray-600">
          Your health check-in has been saved and analyzed.
        </p>
      </div>

      {/* Pregnancy Risk Prediction Result */}
      <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-6 rounded-lg border border-purple-200 mb-8">
        <h3 className="font-poppins font-semibold text-lg text-primary mb-3">
          Pregnancy Risk Prediction
        </h3>
        <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
          <p className="font-poppins text-2xl font-bold text-purple-700">
            {predictionResult?.prediction || predictionResult?.risk_level || 'Assessment Complete'}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="font-poppins font-semibold text-lg mb-4" style={{ color: '#5B3673' }}>
          Summary of Your Submission
        </h3>
        <div className="space-y-3">
          {Object.entries(getSummaryData()).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="font-poppins text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="font-poppins font-medium text-gray-900">
                {value || 'Not provided'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="px-8 py-3 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
            border: 'none',
            color: '#5B3673'
          }}
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/health'}
          className="px-8 py-3 text-lg font-poppins font-medium rounded-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50"
        >
          View History
        </Button>
        
        <Button
          variant="outline"
          onClick={onTakeAgain}
          className="px-8 py-3 text-lg font-poppins font-medium rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Take Again
        </Button>
      </div>
    </div>
  );
};
