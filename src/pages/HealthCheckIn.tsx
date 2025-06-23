
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return 'This field is required';
    }
    
    // Check if the value is a valid number
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }

    // Specific validation for different fields
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
        if (numValue < 3.0 || numValue > 10.0) {
          return 'Please enter a valid blood sugar level (3.0-10.0 mmol/L)';
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

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
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

  const validateForm = () => {
    const newErrors = {
      age: validateField('age', formData.age),
      systolic: validateField('systolic', formData.systolic),
      diastolic: validateField('diastolic', formData.diastolic),
      heartbeat: validateField('heartbeat', formData.heartbeat),
      bloodSugar: validateField('bloodSugar', formData.bloodSugar),
      bodyTemperature: validateField('bodyTemperature', formData.bodyTemperature)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    return !hasErrors;
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
    
    if (!validateForm()) {
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
      console.log('Starting physical health prediction...');
      
      // Convert mmol/L to mg/dL for the API (multiply by 18.018)
      const bloodSugarMgDl = Math.round(parseFloat(formData.bloodSugar) * 18.018);
      
      // Prepare the payload for the API - ensuring all values are numbers
      const apiPayload = {
        age: parseInt(formData.age),
        SystolicBP: parseInt(formData.systolic),
        DiastolicBP: parseInt(formData.diastolic),
        BS: bloodSugarMgDl,
        BodyTemp: parseFloat(formData.bodyTemperature),
        HeartRate: parseInt(formData.heartbeat)
      };
      
      console.log('API payload:', apiPayload);
      
      // Validate that all values are valid numbers
      const hasInvalidNumbers = Object.values(apiPayload).some(value => isNaN(value));
      if (hasInvalidNumbers) {
        throw new Error('Invalid numeric values in form data');
      }

      // Updated API endpoint to match documentation
      const apiUrl = 'https://wellnest-51u4.onrender.com/predict'
      console.log('Making request to:', apiUrl);

      // Send data to external prediction API with better error handling
      const predictionResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiPayload),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(100000) // 30 second timeout
      });

      console.log('API response received:', {
        status: predictionResponse.status,
        statusText: predictionResponse.statusText,
        headers: Object.fromEntries(predictionResponse.headers.entries())
      });

      if (!predictionResponse.ok) {
        let errorMessage = `Physical health API request failed with status: ${predictionResponse.status}`;
        try {
          const errorText = await predictionResponse.text();
          console.error('API error response body:', errorText);
          errorMessage += ` - ${errorText}`;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      let predictionData: PredictionResponse;
      try {
        predictionData = await predictionResponse.json();
        console.log('Parsed prediction response:', predictionData);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from prediction API');
      }

      // Validate response structure
      if (!predictionData.prediction && !predictionData.risk_level) {
        console.error('Invalid response structure:', predictionData);
        throw new Error('Invalid response structure from prediction API');
      }

      // Store in Supabase
      console.log('Saving to database...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);

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
        // Store blood sugar and body temp in the blood_pressure field as JSON
        blood_pressure: JSON.stringify({
          bloodSugar: formData.bloodSugar,
          bodyTemperature: formData.bodyTemperature
        })
      };

      console.log('Database payload:', dbPayload);

      const { error: dbError } = await supabase
        .from('physical_health_checkins')
        .insert(dbPayload);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Physical health data submitted successfully');
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            {showConfirmation ? (
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
                    onClick={handleTakeAgain}
                    className="px-8 py-3 text-lg font-poppins font-medium rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Take Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                  <h1 className="font-poppins font-bold text-3xl text-primary mb-6">
                    Today's Physical Check-In
                  </h1>
                  <h2 className="font-poppins font-bold text-xl mb-8" style={{ color: '#5B3673' }}>
                    Log a few quick details to better understand how your body is doing.
                  </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* Age Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Age <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="age"
                        type="text"
                        placeholder="E.g. 29"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        onBlur={(e) => handleBlur('age', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.age ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.age && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.age}</p>
                      )}
                    </div>

                    {/* Systolic Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Systolic <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="systolic"
                        type="text"
                        placeholder="mmHg"
                        value={formData.systolic}
                        onChange={(e) => handleInputChange('systolic', e.target.value)}
                        onBlur={(e) => handleBlur('systolic', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.systolic ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.systolic && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.systolic}</p>
                      )}
                    </div>

                    {/* Diastolic Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Diastolic <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="diastolic"
                        type="text"
                        placeholder="mmHg"
                        value={formData.diastolic}
                        onChange={(e) => handleInputChange('diastolic', e.target.value)}
                        onBlur={(e) => handleBlur('diastolic', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.diastolic ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.diastolic && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.diastolic}</p>
                      )}
                    </div>

                    {/* Heartbeat Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Heartbeat <span className="text-gray-500">bpm</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="heartbeat"
                        type="text"
                        placeholder="bpm"
                        value={formData.heartbeat}
                        onChange={(e) => handleInputChange('heartbeat', e.target.value)}
                        onBlur={(e) => handleBlur('heartbeat', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.heartbeat ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.heartbeat && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.heartbeat}</p>
                      )}
                    </div>

                    {/* Blood Sugar Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Blood Sugar <span className="text-gray-500">mmol/L</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="bloodSugar"
                        type="text"
                        placeholder="e.g. 5.5"
                        value={formData.bloodSugar}
                        onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                        onBlur={(e) => handleBlur('bloodSugar', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.bloodSugar ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.bloodSugar && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.bloodSugar}</p>
                      )}
                    </div>

                    {/* Body Temperature Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Body Temperature <span className="text-gray-500">°F</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="bodyTemperature"
                        type="text"
                        placeholder="°F"
                        value={formData.bodyTemperature}
                        onChange={(e) => handleInputChange('bodyTemperature', e.target.value)}
                        onBlur={(e) => handleBlur('bodyTemperature', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.bodyTemperature ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.bodyTemperature && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.bodyTemperature}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
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
                      {loading ? 'Analyzing...' : 'Submit'}
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

export default HealthCheckIn;
