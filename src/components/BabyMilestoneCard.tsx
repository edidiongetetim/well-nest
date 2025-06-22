
import { Card, CardContent } from "@/components/ui/card";

export function BabyMilestoneCard() {
  // Dynamic baby size data based on weeks
  const getBabySizeInfo = (week: number) => {
    const sizeData = {
      16: { name: "Apple", emoji: "🍏", size: "4.6 inches" },
      17: { name: "Avocado", emoji: "🥑", size: "5.1 inches" },
      18: { name: "Bell Pepper", emoji: "🫑", size: "5.6 inches" },
      19: { name: "Mango", emoji: "🥭", size: "6.0 inches" },
      20: { name: "Banana", emoji: "🍌", size: "6.5 inches" },
    };
    return sizeData[week as keyof typeof sizeData] || sizeData[16];
  };

  const currentWeek = 16;
  const sizeInfo = getBabySizeInfo(currentWeek);

  return (
    <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
            Your baby is the size of: {sizeInfo.name} {sizeInfo.emoji}
          </h3>
          <p className="font-poppins text-sm text-gray-600">
            Week {currentWeek} • {sizeInfo.size}
          </p>
        </div>
        
        {/* Main circular milestone card with full baby image */}
        <div className="relative mx-auto w-48 h-48 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-full shadow-lg mb-4 overflow-hidden">
          {/* Soft inner shadow overlay */}
          <div className="absolute inset-0 rounded-full shadow-inner bg-gradient-to-br from-white/20 to-transparent"></div>
          
          {/* Full circular baby image */}
          <img 
            src="/lovable-uploads/97cc6b09-0747-494b-adc9-e3aa1ae40cd8.png" 
            alt="Baby in womb illustration" 
            className="w-full h-full object-cover object-center rounded-full"
          />
          
          {/* Additional soft glow effect */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-purple-100/20 blur-sm pointer-events-none"></div>
        </div>
        
        {/* Progress info */}
        <div className="text-center">
          <p className="font-poppins text-gray-600 text-sm">
            {currentWeek} weeks, 2 days · 176 days to childbirth
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
