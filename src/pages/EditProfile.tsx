
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { PregnancyProgressSection } from "@/components/profile/PregnancyProgressSection";
import { HealthSnapshotSection } from "@/components/profile/HealthSnapshotSection";
import { CommunityVisibilitySection } from "@/components/profile/CommunityVisibilitySection";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_type: string;
  avatar_url: string | null;
}

const EditProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("flower1");
  const [dueDate, setDueDate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [glucose, setGlucose] = useState("");
  const [epdsScore, setEpdsScore] = useState("");
  const [communityVisible, setCommunityVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
      setFirstName(profileData.first_name || "");
      setLastName(profileData.last_name || "");
      setSelectedAvatar(profileData.avatar_type || "flower1");
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_type: selectedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setLoading(true);
    try {
      toast({
        title: "Image upload",
        description: "Image upload feature requires storage bucket setup.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="mb-6">
                <h1 className="font-poppins font-bold text-3xl text-primary mb-2">Edit Profile</h1>
                <p className="font-poppins text-gray-600">Manage your personal information and preferences</p>
              </div>

              <PersonalInfoSection
                profile={profile}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                bio={bio}
                setBio={setBio}
                pronouns={pronouns}
                setPronouns={setPronouns}
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
                onImageUpload={handleImageUpload}
                loading={loading}
              />

              <PregnancyProgressSection
                dueDate={dueDate}
                setDueDate={setDueDate}
              />

              <HealthSnapshotSection
                bloodPressure={bloodPressure}
                setBloodPressure={setBloodPressure}
                heartRate={heartRate}
                setHeartRate={setHeartRate}
                glucose={glucose}
                setGlucose={setGlucose}
                epdsScore={epdsScore}
              />

              <CommunityVisibilitySection
                communityVisible={communityVisible}
                setCommunityVisible={setCommunityVisible}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="font-poppins bg-primary hover:bg-primary/90"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="font-poppins"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditProfile;
