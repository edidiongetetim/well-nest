
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Mock user data - in a real app, this would come from your database
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    bio: "First-time mom, 24 weeks pregnant",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Emily Chen",
    avatar: "/placeholder.svg",
    bio: "Mom of twins, sharing the journey",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg",
    bio: "Wellness enthusiast and new mom",
    isFollowing: false,
  },
];

export function CommunitySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [followingUsers, setFollowingUsers] = useState(
    mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.isFollowing }), {})
  );

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
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

      {showResults && filteredUsers.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-poppins font-medium text-sm">{user.name}</p>
                    <p className="font-poppins text-xs text-gray-500 truncate">{user.bio}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={followingUsers[user.id] ? "outline" : "default"}
                  onClick={() => handleFollow(user.id)}
                  className="font-poppins text-xs"
                >
                  {followingUsers[user.id] ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
