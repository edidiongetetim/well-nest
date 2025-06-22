
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";

const HealthCheckIn = () => {
  const [formData, setFormData] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodPressure: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                        Age
                      </label>
                      <Input
                        type="text"
                        placeholder="E.g. 29"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 text-lg focus:border-teal-400 focus:ring-0 placeholder:text-teal-300"
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                    </div>

                    {/* Systolic Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Systolic <span className="text-gray-500">mmHg</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="mmHg"
                        value={formData.systolic}
                        onChange={(e) => handleInputChange('systolic', e.target.value)}
                        className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 text-lg focus:border-teal-400 focus:ring-0 placeholder:text-teal-300"
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                    </div>

                    {/* Diastolic Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Diastolic <span className="text-gray-500">mmHg</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="mmHg"
                        value={formData.diastolic}
                        onChange={(e) => handleInputChange('diastolic', e.target.value)}
                        className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 text-lg focus:border-teal-400 focus:ring-0 placeholder:text-teal-300"
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                    </div>

                    {/* Heartbeat Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Heartbeat <span className="text-gray-500">bpm</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="bpm"
                        value={formData.heartbeat}
                        onChange={(e) => handleInputChange('heartbeat', e.target.value)}
                        className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 text-lg focus:border-teal-400 focus:ring-0 placeholder:text-teal-300"
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
                    </div>

                    {/* Blood Pressure Field */}
                    <div>
                      <label className="block font-poppins text-gray-700 mb-3 text-lg">
                        Blood Pressure <span className="text-gray-500">mmHg</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="mmHg"
                        value={formData.bloodPressure}
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                        className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 text-lg focus:border-teal-400 focus:ring-0 placeholder:text-teal-300"
                        style={{ 
                          borderRadius: '0',
                          boxShadow: 'none'
                        }}
                      />
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
