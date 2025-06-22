
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HealthCard } from "@/components/HealthCard";
import { HealthHistorySection } from "@/components/health/HealthHistorySection";

const Health = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              <div>
                <h1 className="font-poppins font-bold text-3xl text-primary mb-6">
                  Physical Health
                </h1>
                <p className="font-poppins text-gray-600 text-lg mb-8">
                  Track your physical wellness and vital signs to maintain optimal health during your pregnancy journey.
                </p>
              </div>

              {/* Health Check-In Card */}
              <HealthCard />

              {/* Health History Section */}
              <HealthHistorySection type="physical" />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Health;
