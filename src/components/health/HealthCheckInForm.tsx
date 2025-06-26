
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { validateHealthField } from "@/utils/healthValidation";

interface HealthFormData {
  age: string;
  systolic: string;
  diastolic: string;
  heartbeat: string;
  bloodSugar: string;
  bodyTemperature: string;
}

interface HealthCheckInFormProps {
  formData: HealthFormData;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const HealthCheckInForm = ({
  formData,
  errors,
  loading,
  onInputChange,
  onBlur,
  onSubmit
}: HealthCheckInFormProps) => {
  const formFields = [
    {
      id: 'age',
      label: 'Age',
      placeholder: 'E.g. 29',
      unit: '',
      value: formData.age
    },
    {
      id: 'systolic',
      label: 'Systolic',
      placeholder: 'mmHg',
      unit: 'mmHg',
      value: formData.systolic
    },
    {
      id: 'diastolic',
      label: 'Diastolic',
      placeholder: 'mmHg',
      unit: 'mmHg',
      value: formData.diastolic
    },
    {
      id: 'heartbeat',
      label: 'Heartbeat',
      placeholder: 'bpm',
      unit: 'bpm',
      value: formData.heartbeat
    },
    {
      id: 'bloodSugar',
      label: 'Blood Sugar',
      placeholder: 'e.g. 8.5',
      unit: 'mmol/L',
      value: formData.bloodSugar
    },
    {
      id: 'bodyTemperature',
      label: 'Body Temperature',
      placeholder: '°F',
      unit: '°F',
      value: formData.bodyTemperature
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-primary mb-6">
          Today's Physical Check-In
        </h1>
        <h2 className="font-poppins font-bold text-xl mb-8" style={{ color: '#5B3673' }}>
          Log a few quick details to better understand how your body is doing.
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          {formFields.map((field) => (
            <div key={field.id}>
              <label className="block font-poppins text-gray-700 mb-3 text-lg">
                {field.label} {field.unit && <span className="text-gray-500">{field.unit}</span>} <span className="text-red-400">*</span>
              </label>
              <Input
                id={field.id}
                type="text"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                onBlur={(e) => onBlur(field.id, e.target.value)}
                className={`border-0 border-b-2 rounded-none bg-transparent px-0 py-3 text-lg focus:ring-0 placeholder:text-teal-300 ${
                  errors[field.id] ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                }`}
                style={{ 
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
              />
              {errors[field.id] && (
                <p className="mt-2 text-sm text-red-500 font-poppins">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            type="submit"
            disabled={loading}
            className="px-16 py-4 text-lg font-poppins font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #E6D9F0 0%, #C8E6D9 100%)',
              border: 'none',
              color: '#5B3673'
            }}
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};
