
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConfirmationScreenProps {
  title: string;
  summary: Record<string, string>;
  onTakeAgain: () => void;
}

export const ConfirmationScreen = ({ title, summary, onTakeAgain }: ConfirmationScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-100 to-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-teal-600" />
        </div>
        <h1 className="font-poppins font-bold text-2xl text-primary mb-2">
          {title}
        </h1>
        <p className="font-poppins text-lg text-gray-600">
          Your health check-in has been saved.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="font-poppins font-semibold text-lg mb-4" style={{ color: '#5B3673' }}>
          Summary of Your Submission
        </h3>
        <div className="space-y-3">
          {Object.entries(summary).map(([key, value]) => (
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
          onClick={() => navigate('/dashboard')}
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
          onClick={() => navigate('/health')}
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
