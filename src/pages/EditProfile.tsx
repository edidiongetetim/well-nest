
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_type: string;
  avatar_url: string | null;
}

const flowerAvatars = {
  flower1: "🌸",
  flower2: "🌹",
  flower3: "🌺",
  flower4: "🌻",
  flower5: "🌷",
  flower6: "🌼",
  flower7: "🌿",
  flower8: "🌾"
};

const EditProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("flower1");
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
      // Upload to Supabase storage (you'd need to set up a storage bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;
      
      // For now, we'll just show a message that this feature needs storage setup
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
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="font-poppins text-2xl text-primary">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Selection */}
                  <div className="space-y-4">
                    <Label className="font-poppins font-medium">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-primary text-white text-2xl">
                            {flowerAvatars[selectedAvatar as keyof typeof flowerAvatars]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          className="mb-2"
                        >
                          Upload Photo
                        </Button>
                        <p className="text-sm text-gray-500">Or choose a flower avatar below</p>
                      </div>
                    </div>
                    
                    {/* Flower Avatar Options */}
                    <div className="grid grid-cols-8 gap-2">
                      {Object.entries(flowerAvatars).map(([key, emoji]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedAvatar(key)}
                          className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-all ${
                            selectedAvatar === key 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-poppins font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="font-poppins"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-poppins font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="font-poppins"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={loading}
                      className="font-poppins"
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
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditProfile;
