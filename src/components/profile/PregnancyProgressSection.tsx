
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PregnancyProgressSectionProps {
  dueDate: string;
  setDueDate: (value: string) => void;
}

export const PregnancyProgressSection = ({
  dueDate,
  setDueDate
}: PregnancyProgressSectionProps) => {
  const calculatePregnancyInfo = () => {
    if (!dueDate) return { trimester: 1, weeks: 16, days: 2, babySize: "Apple 🍏" };
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = 280; // Average pregnancy length
    const currentDay = totalDays - diffDays;
    const weeks = Math.floor(currentDay / 7);
    const days = currentDay % 7;
    const trimester = weeks <= 12 ? 1 : weeks <= 26 ? 2 : 3;
    
    const babySizes = [
      "Poppy seed 🌱", "Sesame seed", "Apple seed", "Lentil", "Sweet pea",
      "Peppercorn", "Blueberry 🫐", "Raspberry", "Green olive", "Prune",
      "Kumquat", "Lime 🟢", "Plum", "Lemon 🍋", "Apple 🍏", "Avocado 🥑",
      "Turnip", "Bell pepper", "Banana 🍌", "Papaya", "Carrot 🥕",
      "Spaghetti squash", "Mango 🥭", "Corn 🌽", "Cauliflower", "Eggplant 🍆",
      "Cabbage", "Coconut 🥥", "Pineapple 🍍", "Butternut squash", "Honeydew",
      "Cantaloupe", "Jicama", "Romaine lettuce", "Pumpkin 🎃", "Swiss chard",
      "Rhubarb", "Watermelon 🍉", "Leek", "Small pumpkin", "Watermelon 🍉"
    ];
    
    const babySize = babySizes[weeks] || "Watermelon 🍉";
    
    return { trimester, weeks, days, babySize };
  };

  const pregnancyInfo = calculatePregnancyInfo();

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="font-poppins text-xl text-primary">Pregnancy Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="font-poppins font-medium">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="font-poppins"
              />
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-poppins font-semibold text-gray-800 mb-2">Current Progress</h3>
              <p className="font-poppins text-sm text-gray-600">
                Trimester {pregnancyInfo.trimester} • {pregnancyInfo.weeks} weeks, {pregnancyInfo.days} days
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-4xl">{pregnancyInfo.babySize.split(' ')[1] || '👶'}</span>
            </div>
            <p className="font-poppins text-sm text-gray-600">
              Your baby is the size of: <span className="font-semibold">{pregnancyInfo.babySize}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
