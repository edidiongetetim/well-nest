
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  first_name: string | null;
}

export function DynamicGreeting() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    fetchProfile();
    updateGreeting();
    
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
      setEmoji("🌅");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
      setEmoji("☀️");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good Evening");
      setEmoji("🌇");
    } else {
      setGreeting("Good Night");
      setEmoji("🌙");
    }
  };

  const getDisplayName = () => {
    return profile?.first_name || "Friend";
  };

  return (
    <h1 className="font-poppins font-bold text-4xl text-primary mb-2">
      {greeting}, {getDisplayName()}! {emoji}
    </h1>
  );
}
