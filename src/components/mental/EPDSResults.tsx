
import { Check } from "lucide-react";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";

interface EPDSResponse {
  EPDS_Score: number;
  Questions: Record<string, number>;
  Assessment: string;
  Action: string[];
  Anxiety_Flag: boolean;
  Additional_Action: string[];
}

interface EPDSResultsProps {
  epdsResult: EPDSResponse;
  responses: Record<string, string>;
  onTakeAgain: () => void;
}

const getRiskLevelColor = (assessment: string) => {
  const level = assessment.toLowerCase();
  if (level.includes('low')) return 'text-green-600';
  if (level.includes('moderate')) return 'text-yellow-600';
  if (level.includes('high')) return 'text-red-500';
  return 'text-gray-600';
};

const getSummaryData = (epdsResult: EPDSResponse, responses: Record<string, string>) => {
  const totalQuestions = 10; // EPDS has 10 questions
  const answeredQuestions = Object.keys(responses).length;
  const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);
  
  return {
    'Total Questions': totalQuestions.toString(),
    'Questions Answered': answeredQuestions.toString(),
    'Completion Rate': `${completionRate}%`,
    'EPDS Score': epdsResult?.EPDS_Score?.toString() || 'Pending',
    'Risk Level': epdsResult?.Assessment || 'Pending Analysis',
    'Survey Type': 'EPDS Mental Health Check-in'
  };
};

export const EPDSResults = ({ epdsResult, responses, onTakeAgain }: EPDSResultsProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-lavender-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="font-poppins font-bold text-3xl text-primary mb-4">
            ✅ Assessment Complete!
          </h1>
        </div>

        {/* EPDS Results Display */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-6 rounded-lg border">
            <h3 className="font-poppins font-semibold text-xl text-primary mb-4 text-center">
              Your EPDS Results
            </h3>
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  Score: {epdsResult.EPDS_Score}
                </div>
                <div className={`text-xl font-semibold ${getRiskLevelColor(epdsResult.Assessment)}`}>
                  Assessment: {epdsResult.Assessment}
                </div>
              </div>

              {epdsResult.Action && epdsResult.Action.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-3">Recommended Actions:</h4>
                  <ul className="font-poppins text-blue-700 text-left space-y-2">
                    {epdsResult.Action.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {epdsResult.Anxiety_Flag && epdsResult.Additional_Action && epdsResult.Additional_Action.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg mt-4 border border-amber-200">
                  <h4 className="font-poppins font-semibold text-amber-800 mb-3">⚠️ Additional Support Needed:</h4>
                  <ul className="font-poppins text-amber-700 text-left space-y-2">
                    {epdsResult.Additional_Action.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-500 mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <ConfirmationScreen
            title=""
            summary={getSummaryData(epdsResult, responses)}
            onTakeAgain={onTakeAgain}
            hideTitle={true}
          />
        </div>
      </div>
    </div>
  );
};
