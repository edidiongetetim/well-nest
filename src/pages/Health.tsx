
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Health = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/health-check-in');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="font-poppins font-bold text-3xl text-primary mb-8">
                  Let’s Take a Moment for Your Body
                </h1>
              </div>

              {/* Center Content */}
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
                <p className="font-poppins text-xl text-center text-purple-700 max-w-2xl leading-relaxed">
                  Take a few moments to reflect on your physical wellbeing. This check-in helps you understand how your body is doing and if you may want to seek extra support.
                </p>
                
                <Button 
                  onClick={handleStartTest}
                  className="px-12 py-6 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #B39BC8 0%, #9ED9C1 100%)',
                    border: 'none'
                  }}
                >
                  Begin Check-In
                </Button>

                <p className="text-sm text-gray-500 mt-4">
  This survey is for informational purposes only and does not replace professional medical advice.
</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Health;
