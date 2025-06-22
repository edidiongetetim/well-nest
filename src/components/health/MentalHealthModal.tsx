
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
import { AlertCircle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MentalHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EPDSResponse {
  epds_score: number;
  risk_level: string;
}

export const MentalHealthModal = ({ open, onOpenChange }: MentalHealthModalProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [epdsResult, setEpdsResult] = useState<EPDSResponse | null>(null);

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

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Remove from unanswered questions
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
    setShowConfirmation(false);
    setEpdsResult(null);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    const level = riskLevel.toLowerCase();
    if (level.includes('low')) return 'text-green-600';
    if (level.includes('moderate')) return 'text-yellow-600';
    if (level.includes('high')) return 'text-red-500';
    return 'text-gray-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Mental health form submitted with responses:', responses);
    
    if (!validateForm()) {
      console.log('Form validation failed - missing answers');
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending EPDS assessment to API...');
      
      // Convert responses to array of integers in question order
      const responsesArray = questions.map(q => parseInt(responses[q.id]) || 0);
      console.log('Responses array for API:', responsesArray);

      // Send data to EPDS API with correct headers and payload
      const epdsResponse = await fetch('https://wellnest-51u4.onrender.com/epds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          responses: responsesArray
        }),
      });

      console.log('EPDS API response status:', epdsResponse.status);

      if (!epdsResponse.ok) {
        const errorText = await epdsResponse.text();
        console.error('EPDS API error:', errorText);
        throw new Error(`EPDS API request failed with status: ${epdsResponse.status}`);
      }

      const epdsData: EPDSResponse = await epdsResponse.json();
      console.log('EPDS response:', epdsData);

      // Store in Supabase with EPDS result
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);

      const { error } = await supabase
        .from('mental_health_checkins')
        .insert({
          responses,
          epds_score: epdsData.epds_score,
          risk_level: epdsData.risk_level,
          user_id: user?.id
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

      console.log('Mental health data saved successfully');
      setEpdsResult(epdsData);
      setShowConfirmation(true);

      toast({
        title: "✅ Assessment Complete!",
        description: `Your EPDS Score: ${epdsData.epds_score} – ${epdsData.risk_level}`,
      });

    } catch (error) {
      console.error('Error in mental health assessment:', error);
      toast({
        title: "There was an issue processing the mental health check-in. Please try again.",
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

  const handleTakeAgain = () => {
    resetForm();
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-poppins text-2xl text-primary text-center">
              ✅ Assessment Complete!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-lavender-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-purple-600" />
            </div>

            {/* EPDS Results */}
            <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-6 rounded-lg border">
              <h3 className="font-poppins font-semibold text-lg text-primary mb-4">
                Your EPDS Results
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    Score: {epdsResult?.epds_score}
                  </div>
                  <div className={`text-xl font-semibold ${getRiskLevelColor(epdsResult?.risk_level || '')}`}>
                    {epdsResult?.risk_level}
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-poppins font-semibold text-lg mb-4" style={{ color: '#5B3673' }}>
                Assessment Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-poppins text-gray-600">Questions Answered:</span>
                  <span className="font-poppins font-medium ml-2">{questions.length}</span>
                </div>
                <div>
                  <span className="font-poppins text-gray-600">Completion Rate:</span>
                  <span className="font-poppins font-medium ml-2">100%</span>
                </div>
                <div>
                  <span className="font-poppins text-gray-600">Assessment Type:</span>
                  <span className="font-poppins font-medium ml-2">EPDS</span>
                </div>
                <div>
                  <span className="font-poppins text-gray-600">Date:</span>
                  <span className="font-poppins font-medium ml-2">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                onClick={handleClose}
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
                onClick={handleTakeAgain}
                className="px-8 py-3 font-poppins font-medium rounded-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50"
              >
                Take Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                {loading ? 'Analyzing...' : 'Submit Assessment'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
