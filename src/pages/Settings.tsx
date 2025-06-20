
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AccountPreferencesSection } from "@/components/settings/AccountPreferencesSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppPreferencesSection } from "@/components/settings/AppPreferencesSection";
import { DeleteAccountModal } from "@/components/settings/DeleteAccountModal";

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Account preferences state
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications state
  const [reminderAlerts, setReminderAlerts] = useState(true);
  const [chatbotResponses, setChatbotResponses] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);
  const [reminderSchedule, setReminderSchedule] = useState("1hr");

  // App preferences state
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [units, setUnits] = useState("metric");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setPhoneNumber(profileData.phone_number || "");
        // Load other preferences from profile if they exist
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Update profile data
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            phone_number: phoneNumber,
            notification_preferences: {
              reminder_alerts: reminderAlerts,
              chatbot_responses: chatbotResponses,
              community_updates: communityUpdates,
              reminder_schedule: reminderSchedule
            },
            app_preferences: {
              theme,
              language,
              units
            }
          });

        if (profileError) throw profileError;

        // Update password if provided
        if (newPassword && newPassword === confirmPassword) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: newPassword
          });
          if (passwordError) throw passwordError;
          setNewPassword("");
          setConfirmPassword("");
        }

        toast.success("Settings saved successfully!");
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    toast.info("Data export will be available soon");
  };

  const handleDeleteAccount = async () => {
    try {
      // This would need to be implemented with an edge function for proper cleanup
      toast.error("Account deletion requires contacting support");
    } catch (error: any) {
      toast.error("Failed to delete account");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-lavender-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4 font-poppins"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="font-poppins text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="font-poppins text-gray-600">Manage your account and app preferences</p>
          </div>

          <div className="space-y-6">
            <AccountPreferencesSection
              email={email}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onExportData={handleExportData}
              onDeleteAccount={() => setShowDeleteModal(true)}
            />

            <NotificationsSection
              reminderAlerts={reminderAlerts}
              setReminderAlerts={setReminderAlerts}
              chatbotResponses={chatbotResponses}
              setChatbotResponses={setChatbotResponses}
              communityUpdates={communityUpdates}
              setCommunityUpdates={setCommunityUpdates}
              reminderSchedule={reminderSchedule}
              setReminderSchedule={setReminderSchedule}
            />

            <AppPreferencesSection
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              units={units}
              setUnits={setUnits}
            />

            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full font-poppins bg-primary hover:bg-primary/90 transition-colors"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
