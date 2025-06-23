
-- Create a new table for storing complete EPDS results
CREATE TABLE public.mental_epds_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  epds_score INTEGER,
  assessment TEXT,
  anxiety_flag BOOLEAN DEFAULT false,
  actions TEXT,
  extra_actions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.mental_epds_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own EPDS results" 
  ON public.mental_epds_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own EPDS results" 
  ON public.mental_epds_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own EPDS results" 
  ON public.mental_epds_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own EPDS results" 
  ON public.mental_epds_results 
  FOR DELETE 
  USING (auth.uid() = user_id);
