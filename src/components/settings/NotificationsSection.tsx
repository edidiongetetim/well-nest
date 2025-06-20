
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

interface NotificationsSectionProps {
  reminderAlerts: boolean;
  setReminderAlerts: (value: boolean) => void;
  chatbotResponses: boolean;
  setChatbotResponses: (value: boolean) => void;
  communityUpdates: boolean;
  setCommunityUpdates: (value: boolean) => void;
  reminderSchedule: string;
  setReminderSchedule: (value: string) => void;
}

export const NotificationsSection = ({
  reminderAlerts,
  setReminderAlerts,
  chatbotResponses,
  setChatbotResponses,
  communityUpdates,
  setCommunityUpdates,
  reminderSchedule,
  setReminderSchedule
}: NotificationsSectionProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="font-poppins text-xl text-primary">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Reminder Alerts</Label>
              <p className="font-poppins text-sm text-gray-600">
                Get notified about upcoming appointments and tasks
              </p>
            </div>
            <Switch
              checked={reminderAlerts}
              onCheckedChange={setReminderAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Nestie Chatbot Responses</Label>
              <p className="font-poppins text-sm text-gray-600">
                Receive notifications from your AI companion
              </p>
            </div>
            <Switch
              checked={chatbotResponses}
              onCheckedChange={setChatbotResponses}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-poppins font-medium">Community Updates</Label>
              <p className="font-poppins text-sm text-gray-600">
                Stay updated with community posts and discussions
              </p>
            </div>
            <Switch
              checked={communityUpdates}
              onCheckedChange={setCommunityUpdates}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-poppins font-semibold text-gray-800 mb-4">Custom Reminder Schedule</h3>
          <div className="space-y-2">
            <Label className="font-poppins font-medium">Default reminder time</Label>
            <Select value={reminderSchedule} onValueChange={setReminderSchedule}>
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Select default reminder time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hr">1 hour before</SelectItem>
                <SelectItem value="2hr">2 hours before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
                <SelectItem value="2day">2 days before</SelectItem>
                <SelectItem value="1week">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
