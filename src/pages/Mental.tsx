
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HealthHistorySection } from "@/components/health/HealthHistorySection";

const Mental = () => {
  const navigate = useNavigate();

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
                  Mental Health & Wellness
                </h1>
                <p className="font-poppins text-gray-600 text-lg mb-8">
                  Take care of your emotional wellbeing with guided assessments, mindfulness resources, and personalized insights.
                </p>
              </div>

              {/* Mental Health Assessment Card */}
              <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                      <CardTitle className="font-poppins text-xl text-primary">
                        EPDS Mental Health Check-In
                      </CardTitle>
                      <CardDescription className="font-poppins text-gray-600 mt-2">
                        Complete the Edinburgh Postnatal Depression Scale to monitor your emotional wellbeing
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="font-poppins text-gray-700">
                        A 10-question assessment designed to help identify potential mood changes during pregnancy and postpartum.
                      </p>
                      <p className="font-poppins text-sm text-gray-500">
                        Takes about 5 minutes to complete
                      </p>
                    </div>
                    <Button 
                      onClick={() => navigate('/mental-check-in')}
                      className="ml-6 px-8 py-3 font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                        border: 'none',
                        color: '#5B3673'
                      }}
                    >
                      Start Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mental Health History Section */}
              <HealthHistorySection type="mental" />

              {/* Additional Resources */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-pink-500" />
                      <CardTitle className="font-poppins text-lg text-primary">
                        Mindfulness & Meditation
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-poppins text-gray-600 mb-4">
                      Guided meditation sessions designed specifically for expectant mothers to reduce stress and anxiety.
                    </p>
                    <Button variant="outline" className="font-poppins">
                      Explore Sessions
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                      <CardTitle className="font-poppins text-lg text-primary">
                        Support Community
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-poppins text-gray-600 mb-4">
                      Connect with other mothers and share experiences in a supportive, moderated environment.
                    </p>
                    <Button 
                      variant="outline" 
                      className="font-poppins"
                      onClick={() => navigate('/community')}
                    >
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Mental;
