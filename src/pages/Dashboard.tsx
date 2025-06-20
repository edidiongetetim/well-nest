
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HealthCard } from "@/components/HealthCard";
import { PregnancyTracker } from "@/components/PregnancyTracker";
import { EnhancedReminderCard } from "@/components/EnhancedReminderCard";
import { MeditationCard } from "@/components/MeditationCard";
import { DynamicGreeting } from "@/components/DynamicGreeting";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <DynamicGreeting />
                <p className="font-poppins text-gray-600 mb-4">
                  Your Personalized Mental Health Dashboard
                </p>
              </div>

              {/* Pregnancy Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-poppins font-bold text-2xl text-primary mb-2">
                          6 January
                        </h2>
                        <p className="font-poppins text-lg text-gray-700 mb-2">
                          16 weeks, 2 days
                        </p>
                        <p className="font-poppins text-sm text-gray-500">
                          Childbirth: 176 days left
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                          <span className="text-4xl">👶</span>
                        </div>
                        <p className="font-poppins text-sm text-gray-600">
                          Your baby is in a size of: <span className="font-semibold">Apple 🍏</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <PregnancyTracker />
                </div>
              </div>

              {/* Health Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <HealthCard 
                  title="Today's Health Summary"
                  riskLevel="Low Risk"
                  description="Your Physical Health Risk"
                  variant="success"
                />
                
                <HealthCard 
                  title="Today's Health Summary"
                  riskLevel="Medium Risk"
                  description="Your Mental Health Risk"
                  variant="warning"
                />
                
                <EnhancedReminderCard />
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MeditationCard />
                
                <div className="flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <p className="font-poppins text-gray-500 text-center italic">
                    "Your body is amazing. Rest is productive."
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
