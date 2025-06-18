
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PregnancyTracker() {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-poppins text-sm text-gray-600">2nd trimester</span>
            <span className="font-poppins text-sm font-medium text-primary">16 weeks</span>
          </div>
          
          <Progress value={45} className="h-3 bg-gray-100">
            <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300" 
                 style={{width: '45%'}} />
          </Progress>
          
          <div className="flex justify-between items-center">
            <span className="font-poppins text-xs text-gray-500">171 days to childbirth</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
