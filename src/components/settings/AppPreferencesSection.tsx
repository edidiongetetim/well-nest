
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppPreferencesSectionProps {
  theme: string;
  setTheme: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  units: string;
  setUnits: (value: string) => void;
}

export const AppPreferencesSection = ({
  theme,
  setTheme,
  language,
  setLanguage,
  units,
  setUnits
}: AppPreferencesSectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="font-poppins text-xl text-primary">App Preferences</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="font-poppins font-medium">Dark Mode</Label>
            <p className="font-poppins text-sm text-gray-600">
              Switch between light and dark theme
            </p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-poppins font-medium">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="font-poppins">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="font-poppins font-medium">Measurement Units</Label>
            <p className="font-poppins text-sm text-gray-600">
              Choose between metric and imperial units
            </p>
          </div>
          <Switch
            checked={units === "imperial"}
            onCheckedChange={(checked) => setUnits(checked ? "imperial" : "metric")}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-poppins text-sm text-gray-600">
            <span className="font-medium">Current units:</span> {units === "metric" ? "Metric (kg, cm, °C)" : "Imperial (lbs, ft/in, °F)"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
