
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HealthFormData {
  age: string;
  systolic: string;
  diastolic: string;
  heartbeat: string;
  bloodSugar: string;
  bodyTemperature: string;
}

interface HealthCheckInModalFormProps {
  formData: HealthFormData;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const formFields = [
  { id: 'age', label: 'Age', placeholder: 'E.g. 29', unit: '' },
  { id: 'systolic', label: 'Systolic', placeholder: 'mmHg', unit: 'mmHg' },
  { id: 'diastolic', label: 'Diastolic', placeholder: 'mmHg', unit: 'mmHg' },
  { id: 'heartbeat', label: 'Heartbeat', placeholder: 'bpm', unit: 'bpm' },
  { id: 'bloodSugar', label: 'Blood Sugar', placeholder: 'e.g. 8.5', unit: 'mmol/L' },
  { id: 'bodyTemperature', label: 'Body Temperature', placeholder: '°F', unit: '°F' }
];

export const HealthCheckInModalForm = ({
  formData,
  errors,
  loading,
  onInputChange,
  onBlur,
  onSubmit,
  onClose
}: HealthCheckInModalFormProps) => {
  return (
    <div className="space-y-6">
      <p className="font-poppins text-gray-600">
        Log a few quick details to better understand how your body is doing.
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id}>
              <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                {field.label} {field.unit && <span className="text-gray-500">{field.unit}</span>} <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                placeholder={field.placeholder}
                value={formData[field.id as keyof HealthFormData]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                onBlur={(e) => onBlur(field.id, e.target.value)}
                className={`${
                  errors[field.id] ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                }`}
              />
              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-500 font-poppins">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={onClose}
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className="px-8 py-2 font-poppins font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
              border: 'none',
              color: '#5B3673'
            }}
          >
            {loading ? 'Analyzing...' : 'Submit Check-In'}
          </Button>
        </div>
      </form>
    </div>
  );
};
