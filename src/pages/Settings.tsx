import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AccountPreferencesSection } from "@/components/settings/AccountPreferencesSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppPreferencesSection } from "@/components/settings/AppPreferencesSection";
import { PrivacySettingsSection } from "@/components/settings/PrivacySettingsSection";
import { DataManagementSection } from "@/components/settings/DataManagementSection";
import { DeleteAccountModal } from "@/components/settings/DeleteAccountModal";

export default function Settings() {
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

  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [pregnancyTracking, setPregnancyTracking] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);

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
        
        // Load notification preferences
        const notificationPrefs = profileData.notification_preferences as any || {};
        setReminderAlerts(notificationPrefs.reminder_alerts ?? true);
        setChatbotResponses(notificationPrefs.chatbot_responses ?? true);
        setCommunityUpdates(notificationPrefs.community_updates ?? true);
        setReminderSchedule(notificationPrefs.reminder_schedule || "1hr");

        // Load app preferences
        const appPrefs = profileData.app_preferences as any || {};
        setTheme(appPrefs.theme || "light");
        setLanguage(appPrefs.language || "en");
        setUnits(appPrefs.units || "metric");

        // Load privacy settings (using app_preferences for now)
        setProfileVisibility(appPrefs.profile_visibility ?? true);
        setPregnancyTracking(appPrefs.pregnancy_tracking ?? true);
        setDataConsent(appPrefs.data_consent ?? true);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
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
              units,
              profile_visibility: profileVisibility,
              pregnancy_tracking: pregnancyTracking,
              data_consent: dataConsent
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

  const handleDeleteAccount = async () => {
    try {
      toast.error("Account deletion requires contacting support");
    } catch (error: any) {
      toast.error("Failed to delete account");
    }
  };

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <p className="font-poppins text-gray-600">Please log in to access settings.</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-gray-50 z-10 pb-6 mb-6 border-b border-gray-200">
                <h1 className="font-poppins font-bold text-3xl text-primary mb-2">Settings</h1>
                <p className="font-poppins text-gray-600">Manage your account, privacy, and WellNest preferences.</p>
              </div>

              {/* Settings Sections */}
              <div className="space-y-6">
                <AccountPreferencesSection
                  email={email}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  onExportData={() => {}} // This is now handled in DataManagementSection
                  onDeleteAccount={() => setShowDeleteModal(true)}
                />

                <DataManagementSection
                  onExportData={() => {}} // Export is now handled internally
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

                <PrivacySettingsSection
                  profileVisibility={profileVisibility}
                  setProfileVisibility={setProfileVisibility}
                  pregnancyTracking={pregnancyTracking}
                  setPregnancyTracking={setPregnancyTracking}
                  dataConsent={dataConsent}
                  setDataConsent={setDataConsent}
                />

                <AppPreferencesSection
                  theme={theme}
                  setTheme={setTheme}
                  language={language}
                  setLanguage={setLanguage}
                  units={units}
                  setUnits={setUnits}
                />

                {/* Save Button */}
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
          </main>
        </div>
      </div>

      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteAccount}
      />
    </SidebarProvider>
  );
}
