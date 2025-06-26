
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HealthSummaryCard } from "@/components/HealthSummaryCard";
import { PregnancyTracker } from "@/components/PregnancyTracker";
import { EnhancedReminderCard } from "@/components/EnhancedReminderCard";
import { MeditationCard } from "@/components/MeditationCard";
import { DynamicGreeting } from "@/components/DynamicGreeting";
import { BabyMilestoneCard } from "@/components/BabyMilestoneCard";
import { WellnessCards } from "@/components/WellnessCards";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface HealthData {
  physical: {
    riskLevel: string;
    variant: 'success' | 'warning' | 'danger';
    lastUpdated: string;
  } | null;
  mental: {
    riskLevel: string;
    variant: 'success' | 'warning' | 'danger';
    lastUpdated: string;
  } | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>({ physical: null, mental: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealthData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch latest physical health data
      const { data: physicalData } = await supabase
        .from('physical_health_checkins')
        .select('risk_level, prediction_result, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch latest mental health data
      const { data: mentalData } = await supabase
        .from('mental_epds_results')
        .select('assessment, epds_score, submitted_at')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const getVariantFromRisk = (risk: string): 'success' | 'warning' | 'danger' => {
        const lowerRisk = risk.toLowerCase();
        if (lowerRisk.includes('low')) return 'success';
        if (lowerRisk.includes('moderate') || lowerRisk.includes('medium')) return 'warning';
        if (lowerRisk.includes('high')) return 'danger';
        return 'warning';
      };

      const formatRiskLevel = (risk: string): string => {
        const lowerRisk = risk.toLowerCase();
        if (lowerRisk.includes('low')) return 'Low Risk';
        if (lowerRisk.includes('moderate')) return 'Moderate Risk';
        if (lowerRisk.includes('medium')) return 'Medium Risk';
        if (lowerRisk.includes('high')) return 'High Risk';
        return risk;
      };

      setHealthData({
        physical: physicalData ? {
          riskLevel: formatRiskLevel(physicalData.risk_level || physicalData.prediction_result || 'No data'),
          variant: getVariantFromRisk(physicalData.risk_level || physicalData.prediction_result || 'medium'),
          lastUpdated: format(new Date(physicalData.created_at), 'MMM d, yyyy')
        } : null,
        mental: mentalData ? {
          riskLevel: formatRiskLevel(mentalData.assessment || `Score: ${mentalData.epds_score}`),
          variant: getVariantFromRisk(mentalData.assessment || 'medium'),
          lastUpdated: format(new Date(mentalData.submitted_at), 'MMM d, yyyy')
        } : null
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [user]);

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
                      
                      <BabyMilestoneCard />
                    </div>
                  </div>
                </div>
                
                <div>
                  <PregnancyTracker />
                </div>
              </div>

              {/* Health Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <HealthSummaryCard 
                  title="Today's Physical Health Summary"
                  riskLevel={healthData.physical?.riskLevel || "No recent data"}
                  description="Your Physical Health Risk"
                  variant={healthData.physical?.variant || 'warning'}
                  isLoading={isLoading}
                  lastUpdated={healthData.physical?.lastUpdated}
                />
                
                <HealthSummaryCard 
                  title="Today's Mental Health Summary"
                  riskLevel={healthData.mental?.riskLevel || "No recent data"}
                  description="Your Mental Health Risk"
                  variant={healthData.mental?.variant || 'warning'}
                  isLoading={isLoading}
                  lastUpdated={healthData.mental?.lastUpdated}
                />
                
                <EnhancedReminderCard />
              </div>

              {/* Wellness Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <MeditationCard />
                
                <div className="flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <p className="font-poppins text-gray-500 text-center italic">
                    "Your body is amazing. Rest is productive."
                  </p>
                </div>
              </div>

              {/* Recommended Wellness Content */}
              <WellnessCards />

              {/* Footer with Return to Main Site Link */}
              <div className="text-center pt-8 pb-4">
                <Link 
                  to="/" 
                  className="font-poppins text-gray-400 hover:text-purple-600 font-medium transition-colors"
                >
                  ← Return to Main Site
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
