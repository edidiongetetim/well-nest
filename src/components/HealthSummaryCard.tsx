
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";

interface HealthSummaryCardProps {
  title: string;
  riskLevel: string;
  description: string;
  variant: 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  lastUpdated?: string;
}

export const HealthSummaryCard = ({ 
  title, 
  riskLevel, 
  description, 
  variant, 
  isLoading = false,
  lastUpdated 
}: HealthSummaryCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgGradient: 'from-green-50 to-emerald-50',
          riskColor: 'text-green-700'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgGradient: 'from-yellow-50 to-orange-50',
          riskColor: 'text-yellow-700'
        };
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-500',
          bgGradient: 'from-red-50 to-pink-50',
          riskColor: 'text-red-700'
        };
      default:
        return {
          icon: Activity,
          iconColor: 'text-blue-500',
          bgGradient: 'from-blue-50 to-cyan-50',
          riskColor: 'text-blue-700'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className={`bg-gradient-to-r ${styles.bgGradient}`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div>
              <div className="h-5 bg-gray-200 rounded w-48 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="h-6 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <CardHeader className={`bg-gradient-to-r ${styles.bgGradient}`}>
        <div className="flex items-center gap-3">
          <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
          <div>
            <CardTitle className="font-poppins text-lg text-primary">
              {title}
            </CardTitle>
            <CardDescription className="font-poppins text-gray-600 mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <p className={`font-poppins font-semibold text-xl ${styles.riskColor}`}>
            {riskLevel}
          </p>
          {lastUpdated && (
            <p className="font-poppins text-xs text-gray-500 mt-2">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
