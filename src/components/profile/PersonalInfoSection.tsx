
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_type: string;
  avatar_url: string | null;
}

interface PersonalInfoSectionProps {
  profile: Profile | null;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  pronouns: string;
  setPronouns: (value: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
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

export const PersonalInfoSection = ({
  profile,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  pronouns,
  setPronouns,
  selectedAvatar,
  setSelectedAvatar,
  onImageUpload,
  loading
}: PersonalInfoSectionProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(profile?.avatar_url || null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `avatars/${profile.id}/${fileName}`;

      // Delete existing avatar if it exists
      if (profile.avatar_url) {
        const existingPath = profile.avatar_url.split('/').slice(-3).join('/');
        await supabase.storage.from('imagebuckets').remove([existingPath]);
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from('imagebuckets')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Create signed URL
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('imagebuckets')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

      if (urlError) throw urlError;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: signedUrlData.signedUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfileImageUrl(signedUrlData.signedUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been uploaded successfully.",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="font-poppins text-xl text-primary">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Profile Picture Section */}
        <div className="space-y-4">
          <Label className="font-poppins font-medium">Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} alt="Profile" />
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
                disabled={uploadingImage}
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="mb-2 font-poppins"
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Upload Photo"}
              </Button>
              <p className="text-sm text-gray-500 font-poppins">
                Or choose a flower avatar below. Max 5MB.
              </p>
            </div>
          </div>
          
          {/* Flower Avatar Options */}
          <div className="grid grid-cols-8 gap-2">
            {Object.entries(flowerAvatars).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedAvatar(key);
                  setProfileImageUrl(null); // Clear uploaded image when selecting flower avatar
                }}
                className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-all ${
                  selectedAvatar === key && !profileImageUrl
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
  );
};
