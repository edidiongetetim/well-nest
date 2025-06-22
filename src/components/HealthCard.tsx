
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useState } from "react";
import { HealthCheckInModal } from "./health/HealthCheckInModal";

export const HealthCard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <CardTitle className="font-poppins text-xl text-primary">
                Log Your Vitals
              </CardTitle>
              <CardDescription className="font-poppins text-gray-600 mt-2">
                Quickly record your age, blood pressure, heartbeat, and other key vitals to get personalized health insights.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="font-poppins text-gray-700">
                Track your physical wellness and vital signs to maintain optimal health during your pregnancy journey.
              </p>
              <p className="font-poppins text-sm text-gray-500">
                Takes about 3 minutes to complete
              </p>
            </div>
            <Button 
              onClick={() => setShowModal(true)}
              className="ml-6 px-8 py-3 font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
                border: 'none',
                color: '#5B3673'
              }}
            >
              Start Check-In
            </Button>
          </div>
        </CardContent>
      </Card>

      <HealthCheckInModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
};
