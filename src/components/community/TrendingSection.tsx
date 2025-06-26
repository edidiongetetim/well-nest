
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

// Placeholder data
const placeholderHashtags: Hashtag[] = [
  { id: "1", tag: "SingleParents", usage_count: 15 },
  { id: "2", tag: "FirstTrimesterTips", usage_count: 23 },
  { id: "3", tag: "PostpartumSupport", usage_count: 18 },
  { id: "4", tag: "PregnancyJourney", usage_count: 31 },
  { id: "5", tag: "NewMomLife", usage_count: 27 },
  { id: "6", tag: "MentalHealthMatters", usage_count: 19 },
  { id: "7", tag: "SelfCare", usage_count: 14 },
  { id: "8", tag: "PartnerSupport", usage_count: 12 },
];

const placeholderGroups: CommunityGroup[] = [
  {
    id: "1",
    name: "Single Parents Support",
    description: "A supportive community for single parents navigating parenthood alone",
    is_featured: false,
    member_count: 234
  },
  {
    id: "2",
    name: "First Trimester Circle",
    description: "Share experiences and tips for early pregnancy",
    is_featured: false,
    member_count: 156
  },
  {
    id: "3",
    name: "Postpartum Warriors",
    description: "Support for mothers in their postpartum journey",
    is_featured: false,
    member_count: 189
  },
  {
    id: "4",
    name: "Working Moms Unite",
    description: "Balancing career and motherhood together",
    is_featured: false,
    member_count: 278
  },
  {
    id: "5",
    name: "Teen Mom Support",
    description: "A safe space for young mothers",
    is_featured: false,
    member_count: 89
  },
  {
    id: "6",
    name: "Rainbow Baby Families",
    description: "Support for families after pregnancy loss",
    is_featured: false,
    member_count: 67
  }
];

export function TrendingSection() {
  const [hashtags, setHashtags] = useState<Hashtag[]>(placeholderHashtags);
  const [groups, setGroups] = useState<CommunityGroup[]>(placeholderGroups);
  const [loading, setLoading] = useState(false);
  const [showAllHashtags, setShowAllHashtags] = useState(false);

  useEffect(() => {
    // For now, we'll use placeholder data
    // In the future, this will fetch from Supabase
    setHashtags(placeholderHashtags);
    setGroups(placeholderGroups);
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

  const displayedHashtags = showAllHashtags ? hashtags : hashtags.slice(0, 3);

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
          <div className="space-y-3">
            {displayedHashtags.map((hashtag) => (
              <Button
                key={hashtag.id}
                variant="ghost"
                className="justify-start h-auto p-3 hover:bg-purple-50 transition-colors w-full"
              >
                <div className="flex items-center gap-3 w-full">
                  <Hash className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-poppins font-medium text-sm truncate leading-relaxed">
                      #{hashtag.tag}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {hashtag.usage_count} posts
                    </p>
                  </div>
                </div>
              </Button>
            ))}
            
            {hashtags.length > 3 && (
              <Button
                variant="ghost"
                className="text-sm text-purple-400 hover:text-purple-600 font-poppins p-2 h-auto"
                onClick={() => setShowAllHashtags(!showAllHashtags)}
              >
                {showAllHashtags ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community Groups */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="font-poppins text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Community Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {groups.slice(0, 6).map((group) => (
              <div key={group.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-poppins font-medium text-sm mb-2">{group.name}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{group.description}</p>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {group.member_count} members
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-poppins">
                    Join Group
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-mint-50 border border-purple-100">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-poppins font-semibold text-purple-700 mb-3">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-purple-600 text-lg">2.4k+</p>
                <p className="text-gray-600 text-xs">Active Members</p>
              </div>
              <div>
                <p className="font-bold text-purple-600 text-lg">15k+</p>
                <p className="text-gray-600 text-xs">Posts Shared</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
