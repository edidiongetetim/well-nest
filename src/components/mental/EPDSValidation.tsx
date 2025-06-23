
import { AlertCircle } from "lucide-react";

interface ValidationMessageProps {
  unansweredQuestions: string[];
}

export const ValidationMessage = ({ unansweredQuestions }: ValidationMessageProps) => {
  if (unansweredQuestions.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="font-poppins text-red-700">
        Please answer all questions before submitting. {unansweredQuestions.length} question{unansweredQuestions.length > 1 ? 's' : ''} remaining.
      </p>
    </div>
  );
};

export const validateForm = (responses: Record<string, string>, questions: any[]) => {
  const unanswered = questions.filter(q => !responses[q.id]).map(q => q.id);
  return {
    isValid: unanswered.length === 0,
    unansweredQuestions: unanswered
  };
};

export const scrollToFirstUnanswered = (unansweredQuestions: string[]) => {
  if (unansweredQuestions.length > 0) {
    const firstUnansweredElement = document.getElementById(`question-${unansweredQuestions[0]}`);
    if (firstUnansweredElement) {
      firstUnansweredElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};
