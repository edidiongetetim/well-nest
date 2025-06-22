
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthHistoryFilters } from "./HealthHistoryFilters";
import { HealthHistoryCard } from "./HealthHistoryCard";
import { HealthDetailsModal } from "./HealthDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type FilterType = 'week' | 'month' | 'all';

interface HealthHistorySectionProps {
  type: 'physical' | 'mental';
}

export const HealthHistorySection = ({ type }: HealthHistorySectionProps) => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const tableName = type === 'physical' ? 'physical_health_checkins' : 'mental_health_checkins';

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply date filters
      const now = new Date();
      if (activeFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (activeFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query = query.gte('created_at', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching history:', error);
        toast({
          title: "Error loading history",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      setHistoryData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [activeFilter, type]);

  const getSummary = (record: any) => {
    if (type === 'physical') {
      return `Blood Pressure: ${record.systolic}/${record.diastolic} mmHg • Heart Rate: ${record.heartbeat} bpm`;
    } else {
      const score = record.epds_score ? `EPDS Score: ${record.epds_score}` : 'EPDS Assessment';
      const responseCount = record.responses ? Object.keys(record.responses).length : 0;
      return `${score} • ${responseCount} questions answered`;
    }
  };

  const handleViewFull = (id: string) => {
    const record = historyData.find(r => r.id === id);
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting record",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Record deleted successfully",
      });

      // Refresh data
      fetchHistoryData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleShare = (id: string) => {
    // For now, just show a toast - could implement actual sharing later
    toast({
      title: "Share functionality",
      description: "Share feature will be available soon.",
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className={`${
        type === 'physical' 
          ? 'bg-gradient-to-r from-blue-50 to-cyan-50' 
          : 'bg-gradient-to-r from-purple-50 to-pink-50'
      }`}>
        <CardTitle className="font-poppins text-xl text-primary">
          {type === 'physical' ? 'Physical Health' : 'Mental Health'} History
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <HealthHistoryFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
            <span className="ml-2 font-poppins text-gray-600">Loading history...</span>
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-poppins text-gray-500">
              No {type} health records found for the selected time period.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {historyData.map((record) => (
              <HealthHistoryCard
                key={record.id}
                id={record.id}
                date={record.created_at}
                summary={getSummary(record)}
                onViewFull={handleViewFull}
                onDelete={handleDelete}
                onShare={handleShare}
                type={type}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <HealthDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedRecord}
        type={type}
      />
    </Card>
  );
};
