
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface HealthSnapshotSectionProps {
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  heartRate: string;
  setHeartRate: (value: string) => void;
  glucose: string;
  setGlucose: (value: string) => void;
  epdsScore: string;
}

interface PhysicalHealthRecord {
  id: string;
  blood_pressure: string | null;
  heartbeat: string | null;
  systolic: string | null;
  diastolic: string | null;
  prediction_result: string | null;
  risk_level: string | null;
  created_at: string;
}

interface MentalHealthRecord {
  id: string;
  epds_score: number | null;
  assessment: string | null;
  anxiety_flag: boolean | null;
  actions: string | null;
  extra_actions: string | null;
  submitted_at: string;
}

export const HealthSnapshotSection = ({
  bloodPressure,
  setBloodPressure,
  heartRate,
  setHeartRate,
  glucose,
  setGlucose,
  epdsScore
}: HealthSnapshotSectionProps) => {
  const [physicalRecord, setPhysicalRecord] = useState<PhysicalHealthRecord | null>(null);
  const [mentalRecord, setMentalRecord] = useState<MentalHealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch most recent physical health record
      const { data: physicalData } = await supabase
        .from('physical_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch most recent mental health record from the new table
      const { data: mentalData } = await supabase
        .from('mental_epds_results')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      setPhysicalRecord(physicalData);
      setMentalRecord(mentalData);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string | null) => {
    if (!riskLevel) return "text-gray-500";
    const level = riskLevel.toLowerCase();
    if (level.includes('low')) return 'text-green-600';
    if (level.includes('moderate')) return 'text-yellow-600';
    if (level.includes('high')) return 'text-red-500';
    return 'text-gray-600';
  };

  const formatBloodPressure = (systolic: string | null, diastolic: string | null, bloodPressure: string | null) => {
    if (systolic && diastolic) {
      return `${systolic}/${diastolic} mmHg`;
    }
    return bloodPressure || "Not recorded";
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="font-poppins text-xl text-primary">Health Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading health data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="font-poppins text-xl text-primary">Health Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="physical" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="physical" className="font-poppins">Physical</TabsTrigger>
            <TabsTrigger value="mental" className="font-poppins">Mental</TabsTrigger>
          </TabsList>

          <TabsContent value="physical" className="space-y-4">
            {physicalRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="font-poppins font-semibold text-gray-700">Blood Pressure</Label>
                    <p className="font-poppins text-lg text-gray-900">
                      {formatBloodPressure(physicalRecord.systolic, physicalRecord.diastolic, physicalRecord.blood_pressure)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="font-poppins font-semibold text-gray-700">Heart Rate</Label>
                    <p className="font-poppins text-lg text-gray-900">
                      {physicalRecord.heartbeat ? `${physicalRecord.heartbeat} BPM` : "Not recorded"}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Label className="font-poppins font-semibold text-gray-700">Glucose Level</Label>
                    <p className="font-poppins text-lg text-gray-900">Not recorded</p>
                  </div>
                </div>

                {/* Health Risk Assessment */}
                {(physicalRecord.prediction_result || physicalRecord.risk_level) && (
                  <div className="bg-gradient-to-r from-purple-50 to-lavender-50 p-4 rounded-lg border">
                    <Label className="font-poppins font-semibold text-gray-700">Health Risk Assessment</Label>
                    <p className={`font-poppins text-lg font-semibold ${getRiskLevelColor(physicalRecord.risk_level || physicalRecord.prediction_result)}`}>
                      {physicalRecord.prediction_result || physicalRecord.risk_level}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <p className="font-poppins text-sm text-gray-500 mb-3">
                    Last updated: {format(new Date(physicalRecord.created_at), 'MMMM d, yyyy')}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/health-check-in')}
                    className="font-poppins"
                  >
                    Update Vitals
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-poppins text-gray-600 mb-4">
                  You haven't submitted your vitals yet.
                </p>
                <Button 
                  onClick={() => navigate('/health-check-in')}
                  className="font-poppins bg-primary hover:bg-primary/90"
                >
                  Add Your Vitals
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mental" className="space-y-4">
            {mentalRecord && mentalRecord.epds_score !== null ? (
              <div className="space-y-4">
                <div className="bg-lavender-50 p-6 rounded-lg text-center">
                  <Label className="font-poppins font-semibold text-gray-700">EPDS Score & Assessment</Label>
                  <div className="mt-2">
                    <span className="font-poppins text-2xl font-bold text-gray-900">
                      Score: {mentalRecord.epds_score}
                    </span>
                    {mentalRecord.assessment && (
                      <>
                        <span className="mx-2">–</span>
                        <span className={`font-poppins text-lg font-semibold ${getRiskLevelColor(mentalRecord.assessment)}`}>
                          {mentalRecord.assessment}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {mentalRecord.actions && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="font-poppins font-semibold text-blue-800">Recommended Actions:</Label>
                    <p className="font-poppins text-blue-700 mt-2">{mentalRecord.actions}</p>
                  </div>
                )}

                {/* Anxiety Flag & Additional Actions */}
                {mentalRecord.anxiety_flag && mentalRecord.extra_actions && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <Label className="font-poppins font-semibold text-amber-800">⚠️ Additional Support Needed:</Label>
                    <p className="font-poppins text-amber-700 mt-2">{mentalRecord.extra_actions}</p>
                  </div>
                )}

                <div className="text-center">
                  <p className="font-poppins text-sm text-gray-500 mb-3">
                    Last taken: {format(new Date(mentalRecord.submitted_at), 'MMMM d, yyyy')}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/mental-check-in')}
                    className="font-poppins"
                  >
                    Retake Survey
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-poppins text-gray-600 mb-4">
                  No mental health data yet. Take your first assessment to get started.
                </p>
                <Button 
                  onClick={() => navigate('/mental-check-in')}
                  className="font-poppins bg-primary hover:bg-primary/90"
                >
                  Take Survey Now
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
