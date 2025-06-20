
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthSnapshotSectionProps {
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  heartRate: string;
  setHeartRate: (value: string) => void;
  glucose: string;
  setGlucose: (value: string) => void;
  epdsScore: string;
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
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="font-poppins text-xl text-primary">Health Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodPressure" className="font-poppins font-medium">Blood Pressure</Label>
            <Input
              id="bloodPressure"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="120/80"
              className="font-poppins"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="font-poppins font-medium">Heart Rate (BPM)</Label>
            <Input
              id="heartRate"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="75"
              className="font-poppins"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="glucose" className="font-poppins font-medium">Glucose Level</Label>
            <Input
              id="glucose"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="90 mg/dL"
              className="font-poppins"
            />
          </div>
        </div>

        <div className="bg-lavender-50 p-4 rounded-lg">
          <h3 className="font-poppins font-semibold text-gray-800 mb-2">Mental Health Status</h3>
          <p className="font-poppins text-sm text-gray-600 mb-3">
            Last EPDS Score: {epdsScore || "Not taken yet"}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="font-poppins">
              Update Vitals
            </Button>
            <Button variant="outline" className="font-poppins">
              Retake Survey
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
