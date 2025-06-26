
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const useHealthCheckInModal = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<HealthFormData>({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodSugar: '',
    bodyTemperature: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodSugar: '',
    bodyTemperature: ''
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) {
      return 'This field is required';
    }
    
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }

    const numValue = Number(value);
    switch (field) {
      case 'age':
        if (numValue < 1 || numValue > 120) {
          return 'Please enter a valid age (1-120)';
        }
        break;
      case 'systolic':
        if (numValue < 50 || numValue > 300) {
          return 'Please enter a valid systolic pressure (50-300)';
        }
        break;
      case 'diastolic':
        if (numValue < 30 || numValue > 200) {
          return 'Please enter a valid diastolic pressure (30-200)';
        }
        break;
      case 'heartbeat':
        if (numValue < 30 || numValue > 300) {
          return 'Please enter a valid heart rate (30-300)';
        }
        break;
      case 'bloodSugar':
        if (numValue < 6.0 || numValue > 20.0) {
          return 'Please enter a valid blood sugar level (6.0-20.0 mmol/L)';
        }
        break;
      case 'bodyTemperature':
        if (numValue < 95 || numValue > 105) {
          return 'Please enter a valid body temperature (95-105°F)';
        }
        break;
    }
    
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      age: validateField('age', formData.age),
      systolic: validateField('systolic', formData.systolic),
      diastolic: validateField('diastolic', formData.diastolic),
      heartbeat: validateField('heartbeat', formData.heartbeat),
      bloodSugar: validateField('bloodSugar', formData.bloodSugar),
      bodyTemperature: validateField('bodyTemperature', formData.bodyTemperature)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const submitHealthData = async (): Promise<PredictionResponse> => {
    console.log('Starting API request...');
    
    // Prepare the payload for the API in the exact order expected by backend
    // FEATURE_ORDER = ['age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate']
    const apiPayload = {
      age: parseInt(formData.age),
      SystolicBP: parseInt(formData.systolic),
      DiastolicBP: parseInt(formData.diastolic),
      BS: parseFloat(formData.bloodSugar), // Send blood sugar directly as mmol/L (NO conversion)
      BodyTemp: parseFloat(formData.bodyTemperature),
      HeartRate: parseInt(formData.heartbeat)
    };
    
    console.log('API payload (blood sugar in mmol/L, no conversion):', apiPayload);
    console.log('Blood sugar value being sent:', `${formData.bloodSugar} mmol/L -> ${apiPayload.BS}`);
    
    // Validate that all values are valid numbers
    const hasInvalidNumbers = Object.values(apiPayload).some(value => isNaN(value));
    if (hasInvalidNumbers) {
      throw new Error('Invalid numeric values in form data');
    }
    
    // Send data to external prediction API
    const predictionResponse = await fetch('https://wellnest-51u4.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(apiPayload),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!predictionResponse.ok) {
      let errorMessage = `API request failed with status: ${predictionResponse.status}`;
      try {
        const errorText = await predictionResponse.text();
        console.error('API error response body:', errorText);
        errorMessage += ` - ${errorText}`;
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const predictionData: PredictionResponse = await predictionResponse.json();

    // Store in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const dbPayload = {
      age: formData.age,
      systolic: formData.systolic,
      diastolic: formData.diastolic,
      heartbeat: formData.heartbeat,
      prediction_result: predictionData.prediction || predictionData.risk_level || null,
      risk_level: predictionData.risk_level || predictionData.prediction || null,
      user_id: user.id,
      blood_pressure: JSON.stringify({
        bloodSugar: formData.bloodSugar,
        bodyTemperature: formData.bodyTemperature
      })
    };

    const { error: dbError } = await supabase
      .from('physical_health_checkins')
      .insert(dbPayload);

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return predictionData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const predictionData = await submitHealthData();
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

  const resetForm = () => {
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
    setShowConfirmation(false);
    setPredictionResult(null);
  };

  const handleTakeAgain = () => {
    resetForm();
  };

  return {
    formData,
    errors,
    loading,
    showConfirmation,
    predictionResult,
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleTakeAgain,
    resetForm
  };
};
