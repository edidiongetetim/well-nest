
-- Create table for physical health check-ins
CREATE TABLE public.physical_health_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  age TEXT,
  systolic TEXT,
  diastolic TEXT,
  heartbeat TEXT,
  blood_pressure TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for mental health check-ins (EPDS responses)
CREATE TABLE public.mental_health_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  epds_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for physical health check-ins
ALTER TABLE public.physical_health_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies for physical health check-ins
CREATE POLICY "Users can view their own physical check-ins" 
  ON public.physical_health_checkins 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own physical check-ins" 
  ON public.physical_health_checkins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own physical check-ins" 
  ON public.physical_health_checkins 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own physical check-ins" 
  ON public.physical_health_checkins 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for mental health check-ins
ALTER TABLE public.mental_health_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies for mental health check-ins
CREATE POLICY "Users can view their own mental check-ins" 
  ON public.mental_health_checkins 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mental check-ins" 
  ON public.mental_health_checkins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mental check-ins" 
  ON public.mental_health_checkins 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mental check-ins" 
  ON public.mental_health_checkins 
  FOR DELETE 
  USING (auth.uid() = user_id);
