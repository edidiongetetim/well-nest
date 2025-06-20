
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Edit3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

export function ProfileDropdown() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDisplayName = () => {
    if (!profile) return "User";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    return `${firstName} ${lastName}`.trim() || "User";
  };

  const getAvatarDisplay = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return flowerAvatars[profile?.avatar_type as keyof typeof flowerAvatars] || flowerAvatars.flower1;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto">
          <Avatar className="w-8 h-8">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={getDisplayName()} />
            ) : (
              <AvatarFallback className="bg-primary text-white font-poppins text-lg">
                {getAvatarDisplay()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-poppins font-medium text-gray-700">{getDisplayName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/edit-profile')}>
          <Edit3 className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
