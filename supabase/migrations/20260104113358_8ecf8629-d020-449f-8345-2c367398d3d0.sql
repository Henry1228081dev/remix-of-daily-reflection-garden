
-- Create bad_habits table for tracking habits users want to break
CREATE TABLE public.bad_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_name TEXT NOT NULL,
  replacement_habit TEXT,
  days_clean INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_slip_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bad_habit_logs table for tracking urges, resists, and slips
CREATE TABLE public.bad_habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bad_habit_id UUID NOT NULL REFERENCES public.bad_habits(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('urge', 'resist', 'slip')),
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bad_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bad_habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for bad_habits
CREATE POLICY "Users can view their own bad habits"
  ON public.bad_habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bad habits"
  ON public.bad_habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bad habits"
  ON public.bad_habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bad habits"
  ON public.bad_habits FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for bad_habit_logs
CREATE POLICY "Users can view their own bad habit logs"
  ON public.bad_habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bad habit logs"
  ON public.bad_habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bad habit logs"
  ON public.bad_habit_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_bad_habits_updated_at
  BEFORE UPDATE ON public.bad_habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
