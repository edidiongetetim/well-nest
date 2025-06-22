
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MentalHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MentalHealthModal = ({ open, onOpenChange }: MentalHealthModalProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 'laughing',
      question: 'I have been able to laugh and see the funny side of things:',
      options: [
        'As much as I always could',
        'Not quite so much now',
        'Definitely not so much now',
        'Not at all'
      ]
    },
    {
      id: 'enjoyment',
      question: 'I have looked forward with enjoyment to things:',
      options: [
        'As much as I ever did',
        'Rather less than I used to',
        'Definitely less than I used to',
        'Hardly at all'
      ]
    },
    {
      id: 'blaming',
      question: 'I have blamed myself unnecessarily when things went wrong:',
      options: [
        'No, never',
        'Not very often',
        'Yes, some of the time',
        'Yes, most of the time'
      ]
    },
    {
      id: 'anxious',
      question: 'I have been anxious or worried for no good reason:',
      options: [
        'No, not at all',
        'Hardly ever',
        'Yes, sometimes',
        'Yes, very often'
      ]
    },
    {
      id: 'scared',
      question: 'I have felt scared or panicky for no good reason:',
      options: [
        'No, not at all',
        'No, not much',
        'Yes, sometimes',
        'Yes, quite a lot'
      ]
    },
    {
      id: 'overwhelmed',
      question: 'Things have been getting on top of me:',
      options: [
        'No, I am coping as well as ever',
        'No, most of the time I cope quite well',
        'Yes, sometimes I haven\'t been coping as well as usual',
        'Yes, most of the time I haven\'t been coping at all'
      ]
    },
    {
      id: 'sleeping',
      question: 'I have been so unhappy that I have had difficulty sleeping:',
      options: [
        'No, not at all',
        'Not very often',
        'Yes, sometimes',
        'Yes, most of the time'
      ]
    },
    {
      id: 'sad',
      question: 'I have felt sad or miserable:',
      options: [
        'No, not at all',
        'Not very often',
        'Yes, quite often',
        'Yes, most of the time'
      ]
    },
    {
      id: 'crying',
      question: 'I have been so unhappy that I have been crying:',
      options: [
        'No, never',
        'Only occasionally',
        'Yes, quite often',
        'Yes, most of the time'
      ]
    },
    {
      id: 'selfharm',
      question: 'The thought of harming myself has occurred to me:',
      options: [
        'Never',
        'Hardly ever',
        'Sometimes',
        'Yes, quite often'
      ]
    }
  ];

  const calculateEPDSScore = (responses: Record<string, string>) => {
    let score = 0;
    Object.values(responses).forEach(response => {
      score += parseInt(response) || 0;
    });
    return score;
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
  };

  const validateForm = () => {
    const unanswered = questions.filter(q => !responses[q.id]).map(q => q.id);
    setUnansweredQuestions(unanswered);
    return unanswered.length === 0;
  };

  const resetForm = () => {
    setResponses({});
    setUnansweredQuestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const epdsScore = calculateEPDSScore(responses);

      const { error } = await supabase
        .from('mental_health_checkins')
        .insert({
          responses,
          epds_score: epdsScore,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error saving mental health data:', error);
        toast({
          title: "Error saving your check-in",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Mental Health Check-In Complete!",
        description: `EPDS assessment completed. Score: ${epdsScore}`,
      });

      resetForm();
      onOpenChange(false);
      
      // Trigger a page refresh to update the health history
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error saving your check-in",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl text-primary">
            EPDS Mental Health Check-In
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="font-poppins text-gray-600">
            Please indicate how you have felt in the last 7 days:
          </p>

          {unansweredQuestions.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-poppins text-red-700">
                Please answer all questions before submitting. {unansweredQuestions.length} question{unansweredQuestions.length > 1 ? 's' : ''} remaining.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q, index) => (
              <div 
                key={q.id} 
                id={`question-${q.id}`}
                className={`p-4 rounded-lg transition-all duration-200 ${
                  unansweredQuestions.includes(q.id) 
                    ? 'bg-red-50 border-2 border-red-200' 
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <h3 className="font-poppins font-semibold text-base flex-1" style={{ color: '#5B3673' }}>
                    {q.question}
                  </h3>
                  {unansweredQuestions.includes(q.id) && (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  )}
                </div>
                
                <RadioGroup
                  value={responses[q.id] || ''}
                  onValueChange={(value) => handleResponseChange(q.id, value)}
                  className="space-y-3"
                >
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`${q.id}-${optionIndex}`}
                          className="hidden"
                        />
                        <label
                          htmlFor={`${q.id}-${optionIndex}`}
                          className="font-poppins text-gray-700 cursor-pointer flex-1 text-sm"
                        >
                          {option}
                        </label>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleResponseChange(q.id, optionIndex.toString())}
                        className={`w-8 h-8 rounded-full font-poppins font-semibold text-sm transition-all duration-200 ${
                          responses[q.id] === optionIndex.toString()
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                        }`}
                      >
                        {optionIndex}
                      </button>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handleClose}
                className="font-poppins"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="px-8 py-2 font-poppins font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                  border: 'none',
                  color: '#5B3673'
                }}
              >
                {loading ? 'Saving...' : 'Submit Assessment'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
