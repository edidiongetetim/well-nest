
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface HealthCardProps {
  title: string;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  description: string;
  variant?: "success" | "warning" | "danger";
}

export function HealthCard({ title, riskLevel, description, variant = "success" }: HealthCardProps) {
  const getBadgeColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "warning":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "danger":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-semibold text-gray-900">{title}</h3>
            <Badge className={`${getBadgeColor()} font-poppins text-xs`}>
              {riskLevel}
            </Badge>
          </div>
          
          <p className="font-poppins text-sm text-gray-600">{description}</p>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="font-poppins text-xs text-gray-500">
              {variant === "success" ? "Based on age, BP, heart rate, sugar level" : "Based on EPDS test results"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
