
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export function CommunitySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      setUsers(data || []);

      // Check which users the current user is following
      if (user && data) {
        const { data: follows } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', user.id)
          .in('following_id', data.map(u => u.id));

        const followingSet = new Set(follows?.map(f => f.following_id) || []);
        const followingState = data.reduce((acc, u) => {
          acc[u.id] = followingSet.has(u.id);
          return acc;
        }, {} as Record<string, boolean>);

        setFollowingUsers(followingState);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;

    try {
      if (followingUsers[userId]) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        if (!error) {
          setFollowingUsers(prev => ({ ...prev, [userId]: false }));
        }
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });

        if (!error) {
          setFollowingUsers(prev => ({ ...prev, [userId]: true }));
        }
      }
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const getDisplayName = (user: UserProfile) => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Anonymous User";
  };

  return (
    <div className="relative w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search users and posts..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => setShowResults(searchQuery.length > 0)}
          className="pl-10 bg-gray-100 border-0 rounded-full font-poppins"
        />
      </div>

      {showResults && users.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="p-3 text-center text-gray-500">Searching...</div>
            ) : (
              users.map((searchUser) => (
                <div
                  key={searchUser.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={searchUser.avatar_url || undefined} alt={getDisplayName(searchUser)} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getDisplayName(searchUser).split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-poppins font-medium text-sm">{getDisplayName(searchUser)}</p>
                      <p className="font-poppins text-xs text-gray-500">Community Member</p>
                    </div>
                  </div>
                  {user && searchUser.id !== user.id && (
                    <Button
                      size="sm"
                      variant={followingUsers[searchUser.id] ? "outline" : "default"}
                      onClick={() => handleFollow(searchUser.id)}
                      className="font-poppins text-xs"
                    >
                      {followingUsers[searchUser.id] ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
