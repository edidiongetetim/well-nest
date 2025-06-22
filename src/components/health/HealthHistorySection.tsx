import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HealthHistoryFilters } from "./HealthHistoryFilters";
import { HealthHistoryCard } from "./HealthHistoryCard";
import { HealthDetailsModal } from "./HealthDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download } from "lucide-react";
import { exportAllRecordsAsCSV, HealthRecord } from "@/utils/exportUtils";

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
      const vitals = `Blood Pressure: ${record.systolic}/${record.diastolic} mmHg • Heart Rate: ${record.heartbeat} bpm`;
      const riskAssessment = record.prediction_result || record.risk_level;
      return riskAssessment ? `${vitals} • Risk: ${riskAssessment}` : vitals;
    } else {
      const score = record.epds_score ? `EPDS Score: ${record.epds_score}` : 'EPDS Assessment';
      const responseCount = record.responses ? Object.keys(record.responses).length : 0;
      const riskLevel = record.risk_level ? ` • Risk: ${record.risk_level}` : '';
      return `${score} • ${responseCount} questions answered${riskLevel}`;
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

  const handleDownloadAll = () => {
    if (historyData.length === 0) {
      toast({
        title: "No records to export",
        description: "There are no records in the selected time period.",
        variant: "destructive",
      });
      return;
    }

    const records: HealthRecord[] = historyData.map(record => ({
      id: record.id,
      created_at: record.created_at,
      type,
      data: record
    }));

    exportAllRecordsAsCSV(records, activeFilter);
    
    toast({
      title: "Records exported successfully",
      description: `Downloaded ${records.length} ${type} health records.`,
    });
  };

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'week': return 'last 7 days';
      case 'month': return 'this month';
      case 'all': return 'all time';
      default: return 'selected period';
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className={`${
        type === 'physical' 
          ? 'bg-gradient-to-r from-blue-50 to-cyan-50' 
          : 'bg-gradient-to-r from-purple-50 to-pink-50'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="font-poppins text-xl text-primary">
            {type === 'physical' ? 'Physical Health' : 'Mental Health'} History
          </CardTitle>
          {historyData.length > 0 && (
            <Button
              onClick={handleDownloadAll}
              variant="outline"
              size="sm"
              className="font-poppins hover:bg-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download All ({getFilterLabel()})
            </Button>
          )}
        </div>
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
                data={record}
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
