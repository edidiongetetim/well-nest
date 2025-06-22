
-- Add columns to physical_health_checkins table to store prediction results
ALTER TABLE physical_health_checkins 
ADD COLUMN prediction_result TEXT,
ADD COLUMN risk_level TEXT;

-- Add column to mental_health_checkins table to store risk level
ALTER TABLE mental_health_checkins 
ADD COLUMN risk_level TEXT;
