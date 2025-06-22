import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MentalCheckIn = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      question: 'I have looked forward to things with enjoyment:',
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
        'No, most of the time I\'m coping quite well',
        'Yes, sometimes, I\'m not coping as well as usual',
        'Yes, most of the time, I\'m not able to cope at all'
      ]
    },
    {
      id: 'sleeping',
      question: 'I have been so unhappy that I\'ve had difficulty sleeping:',
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
    // Simple EPDS scoring - in a real app, you'd want more sophisticated scoring
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

    // Remove question from unanswered list if it was there
    setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
  };

  const validateForm = () => {
    const unanswered = questions.filter(q => !responses[q.id]).map(q => q.id);
    setUnansweredQuestions(unanswered);
    return unanswered.length === 0;
  };

  const scrollToFirstUnanswered = () => {
    if (unansweredQuestions.length > 0) {
      const firstUnansweredElement = document.getElementById(`question-${unansweredQuestions[0]}`);
      if (firstUnansweredElement) {
        firstUnansweredElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      
      // Scroll to first unanswered question after a brief delay
      setTimeout(scrollToFirstUnanswered, 100);
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

      console.log('Mental health responses submitted successfully');
      setShowConfirmation(true);
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

  const handleTakeAgain = () => {
    setShowConfirmation(false);
    setResponses({});
    setUnansweredQuestions([]);
  };

  const getSummaryData = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(responses).length;
    const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);
    const epdsScore = calculateEPDSScore(responses);
    
    return {
      'Total Questions': totalQuestions.toString(),
      'Questions Answered': answeredQuestions.toString(),
      'Completion Rate': `${completionRate}%`,
      'EPDS Score': epdsScore.toString(),
      'Survey Type': 'EPDS Mental Health Check-in'
    };
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            {showConfirmation ? (
              <ConfirmationScreen
                title="Mental Health Check-In Complete!"
                summary={getSummaryData()}
                onTakeAgain={handleTakeAgain}
              />
            ) : (
              <div className="max-w-4xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                  <h1 className="font-poppins font-bold text-3xl text-primary mb-6">
                    Today's EPDS Check-In
                  </h1>
                  <h2 className="font-poppins font-bold text-xl mb-8" style={{ color: '#5B3673' }}>
                    Please indicate how you have felt in the last 7 days:
                  </h2>
                </div>

                {/* Validation Message */}
                {unansweredQuestions.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="font-poppins text-red-700">
                      Please answer all questions before submitting. {unansweredQuestions.length} question{unansweredQuestions.length > 1 ? 's' : ''} remaining.
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {questions.map((q, index) => (
                    <div 
                      key={q.id} 
                      id={`question-${q.id}`}
                      className={`p-6 rounded-lg shadow-sm transition-all duration-200 ${
                        unansweredQuestions.includes(q.id) 
                          ? 'bg-red-50 border-2 border-red-200' 
                          : 'bg-white border border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-6">
                        <h3 className="font-poppins font-semibold text-lg flex-1" style={{ color: '#5B3673' }}>
                          {q.question}
                        </h3>
                        {unansweredQuestions.includes(q.id) && (
                          <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                      </div>
                      
                      <RadioGroup
                        value={responses[q.id] || ''}
                        onValueChange={(value) => handleResponseChange(q.id, value)}
                        className="space-y-4"
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
                                className="font-poppins text-gray-700 cursor-pointer flex-1"
                              >
                                {option}
                              </label>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleResponseChange(q.id, optionIndex.toString())}
                              className={`w-10 h-10 rounded-full font-poppins font-semibold transition-all duration-200 ${
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

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8 pb-12">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="px-16 py-4 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                        border: 'none',
                        color: '#5B3673'
                      }}
                    >
                      {loading ? 'Saving...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MentalCheckIn;
