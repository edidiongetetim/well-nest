
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HealthCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HealthCheckInModal = ({ open, onOpenChange }: HealthCheckInModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodPressure: ''
  });

  const [errors, setErrors] = useState({
    age: '',
    systolic: '',
    diastolic: '',
    heartbeat: '',
    bloodPressure: ''
  });

  const [loading, setLoading] = useState(false);

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return 'This field is required';
    }
    
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }

    const numValue = Number(value);
    switch (field) {
      case 'age':
        if (numValue < 1 || numValue > 120) {
          return 'Please enter a valid age (1-120)';
        }
        break;
      case 'systolic':
        if (numValue < 50 || numValue > 300) {
          return 'Please enter a valid systolic pressure (50-300)';
        }
        break;
      case 'diastolic':
        if (numValue < 30 || numValue > 200) {
          return 'Please enter a valid diastolic pressure (30-200)';
        }
        break;
      case 'heartbeat':
        if (numValue < 30 || numValue > 300) {
          return 'Please enter a valid heart rate (30-300)';
        }
        break;
      case 'bloodPressure':
        if (numValue < 50 || numValue > 300) {
          return 'Please enter a valid blood pressure';
        }
        break;
    }
    
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {
      age: validateField('age', formData.age),
      systolic: validateField('systolic', formData.systolic),
      diastolic: validateField('diastolic', formData.diastolic),
      heartbeat: validateField('heartbeat', formData.heartbeat),
      bloodPressure: validateField('bloodPressure', formData.bloodPressure)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const resetForm = () => {
    setFormData({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodPressure: ''
    });
    setErrors({
      age: '',
      systolic: '',
      diastolic: '',
      heartbeat: '',
      bloodPressure: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('physical_health_checkins')
        .insert({
          age: formData.age,
          systolic: formData.systolic,
          diastolic: formData.diastolic,
          heartbeat: formData.heartbeat,
          blood_pressure: formData.bloodPressure,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error saving health data:', error);
        toast({
          title: "Error saving your check-in",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Physical Check-In Complete!",
        description: "Your vitals have been recorded successfully.",
      });

      resetForm();
      onOpenChange(false);
      
      // Trigger a page refresh to update the health history
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error saving your check-in",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl text-primary">
            Physical Health Check-In
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="font-poppins text-gray-600">
            Log a few quick details to better understand how your body is doing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Age Field */}
              <div>
                <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                  Age <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="E.g. 29"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  onBlur={(e) => handleBlur('age', e.target.value)}
                  className={`${
                    errors.age ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                  }`}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.age}</p>
                )}
              </div>

              {/* Systolic Field */}
              <div>
                <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                  Systolic <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="mmHg"
                  value={formData.systolic}
                  onChange={(e) => handleInputChange('systolic', e.target.value)}
                  onBlur={(e) => handleBlur('systolic', e.target.value)}
                  className={`${
                    errors.systolic ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                  }`}
                />
                {errors.systolic && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.systolic}</p>
                )}
              </div>

              {/* Diastolic Field */}
              <div>
                <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                  Diastolic <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="mmHg"
                  value={formData.diastolic}
                  onChange={(e) => handleInputChange('diastolic', e.target.value)}
                  onBlur={(e) => handleBlur('diastolic', e.target.value)}
                  className={`${
                    errors.diastolic ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                  }`}
                />
                {errors.diastolic && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.diastolic}</p>
                )}
              </div>

              {/* Heartbeat Field */}
              <div>
                <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                  Heartbeat <span className="text-gray-500">bpm</span> <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="bpm"
                  value={formData.heartbeat}
                  onChange={(e) => handleInputChange('heartbeat', e.target.value)}
                  onBlur={(e) => handleBlur('heartbeat', e.target.value)}
                  className={`${
                    errors.heartbeat ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                  }`}
                />
                {errors.heartbeat && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.heartbeat}</p>
                )}
              </div>

              {/* Blood Pressure Field */}
              <div>
                <label className="block font-poppins text-gray-700 mb-2 text-sm font-medium">
                  Blood Pressure <span className="text-gray-500">mmHg</span> <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="mmHg"
                  value={formData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                  onBlur={(e) => handleBlur('bloodPressure', e.target.value)}
                  className={`${
                    errors.bloodPressure ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-teal-400'
                  }`}
                />
                {errors.bloodPressure && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.bloodPressure}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handleClose}
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
                {loading ? 'Saving...' : 'Submit Check-In'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
