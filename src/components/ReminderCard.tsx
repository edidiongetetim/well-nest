
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function ReminderCard() {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary" />
            <div className="absolute mt-1 ml-1">
              <span className="text-xl font-bold text-primary font-poppins">12</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-gray-900 mb-1">
              Doctor visit next week at 10 AM
            </h3>
            <p className="font-poppins text-sm text-gray-600">12th Jan, 2023</p>
            <button className="font-poppins text-sm text-primary hover:underline mt-2">
              View All Reminders
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
