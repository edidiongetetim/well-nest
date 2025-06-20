
import { Card, CardContent } from "@/components/ui/card";

export function BabyMilestoneCard() {
  return (
    <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
            Your baby is the size of: Apple 🍏
          </h3>
        </div>
        
        {/* Main circular milestone card */}
        <div className="relative mx-auto w-48 h-48 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-full shadow-md mb-4 flex items-center justify-center">
          {/* Baby silhouette on the left */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <div className="w-16 h-20 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full relative">
              {/* Simple baby silhouette using CSS shapes */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-400 rounded-full"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-10 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-3 h-6 bg-purple-400 rounded-full transform rotate-12"></div>
              <div className="absolute bottom-2 right-2 w-3 h-6 bg-purple-400 rounded-full transform -rotate-12"></div>
            </div>
          </div>
          
          {/* Fruit icon on the right */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-300 to-red-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
              🍎
            </div>
          </div>
          
          {/* Week label in center */}
          <div className="text-center">
            <span className="font-poppins font-bold text-purple-600 text-lg">Week 16</span>
          </div>
        </div>
        
        {/* Progress info */}
        <div className="text-center">
          <p className="font-poppins text-gray-600 text-sm">
            16 weeks, 2 days · 176 days to childbirth
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
