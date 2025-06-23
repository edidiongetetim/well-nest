
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  title: string;
  content?: string;
  type: 'reminder' | 'post' | 'health_log';
  created_at: string;
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Search reminders
      const { data: reminders } = await supabase
        .from('reminders')
        .select('id, title, description, created_at')
        .eq('user_id', user.id)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

      // Search posts
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

      // Search mental health check-ins (as health logs)
      const { data: mentalHealthLogs } = await supabase
        .from('mental_health_checkins')
        .select('id, created_at')
        .eq('user_id', user.id);

      const searchResults: SearchResult[] = [];

      // Add reminders to results
      if (reminders) {
        reminders.forEach(reminder => {
          searchResults.push({
            id: reminder.id,
            title: reminder.title,
            content: reminder.description,
            type: 'reminder',
            created_at: reminder.created_at
          });
        });
      }

      // Add posts to results
      if (posts) {
        posts.forEach(post => {
          searchResults.push({
            id: post.id,
            title: post.title,
            content: post.content,
            type: 'post',
            created_at: post.created_at
          });
        });
      }

      // Add health logs to results
      if (mentalHealthLogs) {
        mentalHealthLogs.forEach(log => {
          searchResults.push({
            id: log.id,
            title: 'Mental Health Check-in',
            content: `Check-in completed on ${format(new Date(log.created_at), 'MMM d, yyyy')}`,
            type: 'health_log',
            created_at: log.created_at
          });
        });
      }

      // Sort by created_at desc
      searchResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'post':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'health_log':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!query.trim()) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto bg-white border border-gray-200 shadow-lg">
      <CardContent className="p-4">
        <h3 className="font-poppins font-semibold text-gray-900 mb-3">
          Search Results for "{query}"
        </h3>
        
        {loading ? (
          <div className="text-center py-4">
            <p className="font-poppins text-gray-500">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-4">
            <p className="font-poppins text-gray-500">No results found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                {getResultIcon(result.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-poppins font-medium text-sm text-gray-900 truncate">
                    {result.title}
                  </p>
                  {result.content && (
                    <p className="font-poppins text-xs text-gray-500 mt-1 line-clamp-2">
                      {result.content}
                    </p>
                  )}
                  <p className="font-poppins text-xs text-gray-400 mt-1">
                    {format(new Date(result.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="font-poppins text-xs text-gray-400 capitalize">
                  {result.type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
