
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
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
                onChange={onImageUpload}
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
  );
};
