
import { supabase } from "@/integrations/supabase/client";

interface PredictionResponse {
  prediction?: string;
  risk_level?: string;
}

interface HealthFormData {
  age: string;
  systolic: string;
  diastolic: string;
  heartbeat: string;
  bloodSugar: string;
  bodyTemperature: string;
}

export const submitHealthPrediction = async (formData: HealthFormData): Promise<PredictionResponse> => {
  console.log('Starting physical health prediction...');
  
  // Prepare the payload for the API in the exact order expected by backend
  // FEATURE_ORDER = ['age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate']
  const apiPayload = {
    age: parseInt(formData.age),
    SystolicBP: parseInt(formData.systolic),
    DiastolicBP: parseInt(formData.diastolic),
    BS: parseFloat(formData.bloodSugar), // Send blood sugar directly as mmol/L (NO conversion)
    BodyTemp: parseFloat(formData.bodyTemperature),
    HeartRate: parseInt(formData.heartbeat)
  };
  
  console.log('API payload (blood sugar in mmol/L, no conversion):', apiPayload);
  console.log('Blood sugar value being sent:', `${formData.bloodSugar} mmol/L -> ${apiPayload.BS}`);
  
  // Validate that all values are valid numbers
  const hasInvalidNumbers = Object.values(apiPayload).some(value => isNaN(value));
  if (hasInvalidNumbers) {
    throw new Error('Invalid numeric values in form data');
  }

  // Updated API endpoint to match documentation
  const apiUrl = 'https://wellnest-51u4.onrender.com/predict';
  console.log('Making request to:', apiUrl);

  // Send data to external prediction API with better error handling
  const predictionResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(apiPayload),
    // Add timeout to prevent hanging requests
    signal: AbortSignal.timeout(100000) // 100 second timeout
  });

  console.log('API response received:', {
    status: predictionResponse.status,
    statusText: predictionResponse.statusText,
    headers: Object.fromEntries(predictionResponse.headers.entries())
  });

  if (!predictionResponse.ok) {
    let errorMessage = `Physical health API request failed with status: ${predictionResponse.status}`;
    try {
      const errorText = await predictionResponse.text();
      console.error('API error response body:', errorText);
      errorMessage += ` - ${errorText}`;
    } catch (parseError) {
      console.error('Could not parse error response:', parseError);
    }
    throw new Error(errorMessage);
  }

  let predictionData: PredictionResponse;
  try {
    predictionData = await predictionResponse.json();
    console.log('Parsed prediction response:', predictionData);
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError);
    throw new Error('Invalid JSON response from prediction API');
  }

  // Validate response structure
  if (!predictionData.prediction && !predictionData.risk_level) {
    console.error('Invalid response structure:', predictionData);
    throw new Error('Invalid response structure from prediction API');
  }

  // Store in Supabase
  console.log('Saving to database...');
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user?.id);

  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  const dbPayload = {
    age: formData.age,
    systolic: formData.systolic,
    diastolic: formData.diastolic,
    heartbeat: formData.heartbeat,
    prediction_result: predictionData.prediction || predictionData.risk_level || null,
    risk_level: predictionData.risk_level || predictionData.prediction || null,
    user_id: user.id,
    // Store blood sugar and body temp in the blood_pressure field as JSON
    blood_pressure: JSON.stringify({
      bloodSugar: formData.bloodSugar,
      bodyTemperature: formData.bodyTemperature
    })
  };

  console.log('Database payload:', dbPayload);

  const { error: dbError } = await supabase
    .from('physical_health_checkins')
    .insert(dbPayload);

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error(`Database error: ${dbError.message}`);
  }

  console.log('Physical health data submitted successfully');
  return predictionData;
};
