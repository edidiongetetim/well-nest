
interface ConfirmationScreenProps {
  title: string;
  summary: Record<string, string>;
  onTakeAgain: () => void;
  hideTitle?: boolean;
}

export const ConfirmationScreen = ({ title, summary, onTakeAgain, hideTitle = false }: ConfirmationScreenProps) => {
  return (
    <div className="space-y-6">
      {!hideTitle && (
        <div className="text-center">
          <h2 className="font-poppins font-bold text-2xl text-primary mb-4">
            {title}
          </h2>
        </div>
      )}

      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-poppins font-semibold text-lg mb-4" style={{ color: '#5B3673' }}>
          Assessment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="font-poppins text-gray-600">{key}:</span>
              <span className="font-poppins font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onTakeAgain}
          className="px-8 py-3 font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-400 text-purple-600 hover:bg-purple-50"
        >
          Take Again
        </button>
      </div>
    </div>
  );
};
