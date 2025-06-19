
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";

const Mental = () => {
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
                  Quick Emotional Wellness Survey
                </h1>
              </div>

              {/* Center Content */}
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
                <div className="text-center max-w-3xl space-y-4">
                  <p className="font-poppins text-xl text-center leading-relaxed" style={{ color: '#5B3673' }}>
                    This short questionnaire is designed to gently check in with your emotional wellbeing over the past 7 days.
                  </p>
                  <p className="font-poppins text-xl text-center leading-relaxed" style={{ color: '#5B3673' }}>
                    It takes about 2 minutes. Your responses are private.
                  </p>
                </div>
                
                <Button 
                  className="px-12 py-6 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                    border: 'none',
                    color: '#5B3673'
                  }}
                >
                  Start Test
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Mental;
