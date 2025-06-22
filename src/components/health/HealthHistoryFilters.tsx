
import { Button } from "@/components/ui/button";

type FilterType = 'week' | 'month' | 'all';

interface HealthHistoryFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const HealthHistoryFilters = ({
  activeFilter,
  onFilterChange
}: HealthHistoryFiltersProps) => {
  const filters = [
    { key: 'week' as FilterType, label: 'Last 7 days' },
    { key: 'month' as FilterType, label: 'This month' },
    { key: 'all' as FilterType, label: 'All time' }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className={`font-poppins transition-all duration-200 ${
            activeFilter === filter.key
              ? 'bg-teal-500 text-white border-teal-500 hover:bg-teal-600'
              : 'text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
