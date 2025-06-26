
export const validateHealthField = (field: string, value: string) => {
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
    case 'bloodSugar':
      if (numValue < 6.0 || numValue > 20.0) {
        return 'Please enter a valid blood sugar level (6.0-20.0 mmol/L)';
      }
      break;
    case 'bodyTemperature':
      if (numValue < 95 || numValue > 105) {
        return 'Please enter a valid body temperature (95-105°F)';
      }
      break;
  }
  
  return '';
};

export const validateHealthForm = (formData: any) => {
  const newErrors = {
    age: validateHealthField('age', formData.age),
    systolic: validateHealthField('systolic', formData.systolic),
    diastolic: validateHealthField('diastolic', formData.diastolic),
    heartbeat: validateHealthField('heartbeat', formData.heartbeat),
    bloodSugar: validateHealthField('bloodSugar', formData.bloodSugar),
    bodyTemperature: validateHealthField('bodyTemperature', formData.bodyTemperature)
  };

  const hasErrors = Object.values(newErrors).some(error => error !== '');
  return { errors: newErrors, hasErrors };
};
