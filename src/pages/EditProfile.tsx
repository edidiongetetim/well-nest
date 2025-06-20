
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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

              {/* Personal Information */}
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="font-poppins text-xl text-primary">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
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
                          className="mb-2 font-poppins"
                        >
                          Upload Photo
                        </Button>
                        <p className="text-sm text-gray-500 font-poppins">Or choose a flower avatar below</p>
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

                  {/* Name and Bio */}
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

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-poppins font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a little about yourself..."
                      className="font-poppins min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-poppins font-medium">Pronouns</Label>
                    <Select value={pronouns} onValueChange={setPronouns}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue placeholder="Select your pronouns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="she/her">She/Her</SelectItem>
                        <SelectItem value="he/him">He/Him</SelectItem>
                        <SelectItem value="they/them">They/Them</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Pregnancy Progress */}
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

              {/* Health Snapshot */}
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="font-poppins text-xl text-primary">Health Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodPressure" className="font-poppins font-medium">Blood Pressure</Label>
                      <Input
                        id="bloodPressure"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        placeholder="120/80"
                        className="font-poppins"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate" className="font-poppins font-medium">Heart Rate (BPM)</Label>
                      <Input
                        id="heartRate"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        placeholder="75"
                        className="font-poppins"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="glucose" className="font-poppins font-medium">Glucose Level</Label>
                      <Input
                        id="glucose"
                        value={glucose}
                        onChange={(e) => setGlucose(e.target.value)}
                        placeholder="90 mg/dL"
                        className="font-poppins"
                      />
                    </div>
                  </div>

                  <div className="bg-lavender-50 p-4 rounded-lg">
                    <h3 className="font-poppins font-semibold text-gray-800 mb-2">Mental Health Status</h3>
                    <p className="font-poppins text-sm text-gray-600 mb-3">
                      Last EPDS Score: {epdsScore || "Not taken yet"}
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="font-poppins">
                        Update Vitals
                      </Button>
                      <Button variant="outline" className="font-poppins">
                        Retake Survey
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Visibility */}
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
                  <CardTitle className="font-poppins text-xl text-primary">Community Visibility</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-poppins font-medium">Show my bio and baby progress on community posts</Label>
                      <p className="font-poppins text-sm text-gray-600 mt-1">
                        Allow other community members to see your profile information when you post
                      </p>
                    </div>
                    <Switch
                      checked={communityVisible}
                      onCheckedChange={setCommunityVisible}
                    />
                  </div>
                </CardContent>
              </Card>

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
