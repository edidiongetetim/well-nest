
import { Card, CardContent } from "@/components/ui/card";

export function MeditationCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm border border-purple-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-purple-800 mb-2">Meditation</h3>
            <p className="font-poppins text-sm text-purple-600 mb-1">
              Calm your mind
            </p>
            <p className="font-poppins text-sm text-purple-600">
              Rest your body
            </p>
          </div>
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🧘‍♀️</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
