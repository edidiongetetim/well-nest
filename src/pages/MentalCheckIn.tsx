
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EPDSForm, questions } from "@/components/mental/EPDSForm";
import { EPDSResults } from "@/components/mental/EPDSResults";
import { validateForm, scrollToFirstUnanswered } from "@/components/mental/EPDSValidation";

// Updated interface to match the actual API response structure
interface EPDSResponse {
  EPDS_Score: number;
  Questions: Record<string, number>;
  Assessment: string;
  Action: string[] | string;
  Anxiety_Flag: boolean;
  Additional_Action: string[] | string;
}

const MentalCheckIn = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [epdsResult, setEpdsResult] = useState<EPDSResponse | null>(null);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Remove question from unanswered list if it was there
    setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm(responses, questions);
    if (!validation.isValid) {
      setUnansweredQuestions(validation.unansweredQuestions);
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      
      setTimeout(() => scrollToFirstUnanswered(validation.unansweredQuestions), 100);
      return;
    }

    setLoading(true);

    try {
      console.log('Starting EPDS assessment...');
      
      // Convert responses to array of integers in the correct question order
      const responsesArray = questions.map(q => {
        const responseValue = responses[q.id];
        const intValue = parseInt(responseValue);
        console.log(`Question ${q.id}: response "${responseValue}" -> ${intValue}`);
        return isNaN(intValue) ? 0 : intValue;
      });
      
      console.log('Final responses array for API:', responsesArray);

      // Validate we have 10 responses
      if (responsesArray.length !== 10) {
        throw new Error(`Invalid responses array length: ${responsesArray.length}, expected 10`);
      }

      // Send data to EPDS API with corrected endpoint
      console.log('Making request to EPDS API endpoint: /epds');
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
        console.error('EPDS API error response:', errorText);
        throw new Error(`API responded with ${epdsResponse.status}: ${errorText}`);
      }

      const responseText = await epdsResponse.text();
      console.log('Raw API response:', responseText);

      let epdsData: EPDSResponse;
      try {
        epdsData = JSON.parse(responseText);
        console.log('Parsed EPDS API response data:', epdsData);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from API');
      }

      // Normalize the data to handle both string and array formats
      const normalizedData: EPDSResponse = {
        ...epdsData,
        Action: Array.isArray(epdsData.Action) ? epdsData.Action : (epdsData.Action ? [epdsData.Action] : []),
        Additional_Action: Array.isArray(epdsData.Additional_Action) ? epdsData.Additional_Action : (epdsData.Additional_Action ? [epdsData.Additional_Action] : [])
      };

      console.log('Normalized EPDS data:', normalizedData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Save to the mental_epds_results table
      console.log('Saving EPDS results to Supabase...');
      const { error: epdsError } = await supabase
        .from('mental_epds_results')
        .insert({
          user_id: user.id,
          submitted_at: new Date().toISOString(),
          epds_score: normalizedData.EPDS_Score,
          assessment: normalizedData.Assessment,
          anxiety_flag: normalizedData.Anxiety_Flag,
          actions: Array.isArray(normalizedData.Action) ? normalizedData.Action.join('; ') : (normalizedData.Action || ''),
          extra_actions: Array.isArray(normalizedData.Additional_Action) ? normalizedData.Additional_Action.join('; ') : (normalizedData.Additional_Action || '')
        });

      if (epdsError) {
        console.error('Supabase EPDS error:', epdsError);
        throw new Error(`Database error: ${epdsError.message}`);
      }

      console.log('EPDS data saved successfully to database');

      // Also save to the existing mental_health_checkins table for backward compatibility
      const { error: checkinsError } = await supabase
        .from('mental_health_checkins')
        .insert({
          responses,
          epds_score: normalizedData.EPDS_Score,
          risk_level: normalizedData.Assessment,
          user_id: user.id
        });

      if (checkinsError) {
        console.error('Supabase checkins error:', checkinsError);
        // Don't throw here as the main data is already saved
      }

      setEpdsResult(normalizedData);
      console.log('Mental health assessment completed successfully');
      setShowConfirmation(true);

      toast({
        title: "✅ EPDS Assessment Complete",
        description: `Your score: ${normalizedData.EPDS_Score} – ${normalizedData.Assessment}`,
      });

    } catch (error) {
      console.error('Complete error details:', error);
      
      toast({
        title: "Assessment could not be processed",
        description: error instanceof Error ? error.message : "Please try again later or contact support if the issue persists.",
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
    setEpdsResult(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6">
            {showConfirmation && epdsResult ? (
              <EPDSResults 
                epdsResult={epdsResult}
                responses={responses}
                onTakeAgain={handleTakeAgain}
              />
            ) : (
              <EPDSForm
                responses={responses}
                unansweredQuestions={unansweredQuestions}
                loading={loading}
                onResponseChange={handleResponseChange}
                onSubmit={handleSubmit}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MentalCheckIn;
