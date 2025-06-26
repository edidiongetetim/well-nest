
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateHealthField, validateHealthForm } from "@/utils/healthValidation";
import { HealthCheckInForm } from "@/components/health/HealthCheckInForm";
import { HealthCheckInConfirmation } from "@/components/health/HealthCheckInConfirmation";
import { submitHealthPrediction } from "@/services/healthPredictionService";

interface PredictionResponse {
  prediction?: string;
  risk_level?: string;
}

const HealthCheckIn = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodSugar: '',
    bodyTemperature: ''
  });

  const [errors, setErrors] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodSugar: '',
    bodyTemperature: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateHealthField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const scrollToFirstError = () => {
    const errorFields = Object.entries(errors).find(([_, error]) => error !== '');
    if (errorFields) {
      const fieldElement = document.getElementById(errorFields[0]);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    const { errors: validationErrors, hasErrors } = validateHealthForm(formData);
    setErrors(validationErrors);
    
    if (hasErrors) {
      toast({
        title: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      
      // Scroll to first error after a brief delay to allow toast to show
      setTimeout(scrollToFirstError, 100);
      return;
    }

    setLoading(true);

    try {
      const predictionData = await submitHealthPrediction(formData);
      setPredictionResult(predictionData);
      setShowConfirmation(true);

      toast({
        title: "✅ Check-In Complete!",
        description: "Your vitals have been recorded and analyzed.",
      });

    } catch (error) {
      console.error('Complete error details:', error);
      
      let userMessage = "There was an issue analyzing your health data. Please try again.";
      let description = "";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          userMessage = "Request timed out. Please check your internet connection and try again.";
        } else if (error.message.includes('fetch')) {
          userMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes('JSON')) {
          userMessage = "Server returned invalid data. Please try again later.";
        } else if (error.message.includes('API request failed')) {
          userMessage = "The health prediction service is currently unavailable. Please try again later.";
        }
        description = error.message;
      }
      
      toast({
        title: userMessage,
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAgain = () => {
    setShowConfirmation(false);
    setFormData({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodSugar: '',
      bodyTemperature: ''
    });
    setErrors({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodSugar: '',
      bodyTemperature: ''
    });
    setPredictionResult(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            {showConfirmation ? (
              <HealthCheckInConfirmation
                formData={formData}
                predictionResult={predictionResult}
                onTakeAgain={handleTakeAgain}
              />
            ) : (
              <HealthCheckInForm
                formData={formData}
                errors={errors}
                loading={loading}
                onInputChange={handleInputChange}
                onBlur={handleBlur}
                onSubmit={handleSubmit}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HealthCheckIn;
