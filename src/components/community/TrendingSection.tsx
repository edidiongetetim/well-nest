
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hash, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Hashtag {
  id: string;
  tag: string;
  usage_count: number;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  is_featured: boolean;
  member_count: number;
}

export function TrendingSection() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        // Fetch trending hashtags
        const { data: hashtagData, error: hashtagError } = await supabase
          .from("hashtags")
          .select("*")
          .order("usage_count", { ascending: false })
          .limit(8);

        if (hashtagError) throw hashtagError;
        setHashtags(hashtagData || []);

        // Fetch featured groups
        const { data: groupData, error: groupError } = await supabase
          .from("community_groups")
          .select("*")
          .eq("is_featured", true)
          .order("member_count", { ascending: false })
          .limit(6);

        if (groupError) throw groupError;
        setGroups(groupData || []);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="font-poppins text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {hashtags.map((hashtag) => (
              <Button
                key={hashtag.id}
                variant="ghost"
                className="justify-start h-auto p-2 hover:bg-purple-50"
              >
                <div className="flex items-center gap-2 w-full">
                  <Hash className="w-4 h-4 text-purple-500" />
                  <div className="text-left">
                    <p className="font-poppins font-medium text-sm">#{hashtag.tag}</p>
                    <p className="text-xs text-gray-500">{hashtag.usage_count} posts</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Groups */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="font-poppins text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Featured Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-poppins font-medium text-sm mb-1">{group.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{group.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {group.member_count} members
                      </Badge>
                      {group.is_featured && (
                        <Badge className="text-xs bg-purple-100 text-purple-700">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white">
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-mint-50 border border-purple-100">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-poppins font-semibold text-purple-700 mb-2">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-purple-600">2.4k+</p>
                <p className="text-gray-600">Active Members</p>
              </div>
              <div>
                <p className="font-bold text-purple-600">15k+</p>
                <p className="text-gray-600">Posts Shared</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
