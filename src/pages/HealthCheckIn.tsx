
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { useToast } from "@/hooks/use-toast";

const HealthCheckIn = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodPressure: ''
  });

  const [errors, setErrors] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodPressure: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

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
      case 'bloodPressure':
        if (numValue < 50 || numValue > 300) {
          return 'Please enter a valid blood pressure';
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
      bloodPressure: validateField('bloodPressure', formData.bloodPressure)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      
      // Scroll to first error after a brief delay to allow toast to show
      setTimeout(scrollToFirstError, 100);
      return;
    }

    console.log('Physical health data submitted:', formData);
    setShowConfirmation(true);
  };

  const handleTakeAgain = () => {
    setShowConfirmation(false);
    setFormData({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodPressure: ''
    });
    setErrors({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodPressure: ''
    });
  };

  const getSummaryData = () => {
    return {
      age: formData.age,
      systolic: formData.systolic ? `${formData.systolic} mmHg` : '',
      diastolic: formData.diastolic ? `${formData.diastolic} mmHg` : '',
      heartbeat: formData.heartbeat ? `${formData.heartbeat} bpm` : '',
      bloodPressure: formData.bloodPressure ? `${formData.bloodPressure} mmHg` : ''
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
                title="Physical Check-In Complete!"
                summary={getSummaryData()}
                onTakeAgain={handleTakeAgain}
              />
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

                    {/* Blood Pressure Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Blood Pressure <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="bloodPressure"
                        type="text"
                        placeholder="mmHg"
                        value={formData.bloodPressure}
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                        onBlur={(e) => handleBlur('bloodPressure', e.target.value)}
                        className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                          errors.bloodPressure ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                        }`}
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                      {errors.bloodPressure && (
                        <p className="mt-2 text-sm text-red-500 font-poppins">{errors.bloodPressure}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                    <Button 
                      type="submit"
                      className="px-16 py-4 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                        border: 'none',
                        color: '#5B3673'
                      }}
                    >
                      Submit
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
