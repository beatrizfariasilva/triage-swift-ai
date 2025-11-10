-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('triage_professional', 'admin_professional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create triage_records table with Manchester Protocol
CREATE TABLE public.triage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_cpf TEXT NOT NULL,
  patient_birth_date DATE NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT,
  
  -- Manchester Protocol Classification
  classification TEXT NOT NULL CHECK (classification IN ('red', 'orange', 'yellow', 'green', 'blue')),
  
  -- Vital Signs
  blood_pressure TEXT,
  heart_rate INTEGER,
  oxygen_saturation INTEGER,
  temperature DECIMAL(4,1),
  
  -- Clinical Data
  symptoms TEXT NOT NULL,
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  observations TEXT,
  
  -- Metadata
  triage_professional_id UUID REFERENCES public.profiles(id),
  wait_time_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_care', 'completed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.triage_records ENABLE ROW LEVEL SECURITY;

-- Triage records policies
CREATE POLICY "Authenticated users can view triage records"
  ON public.triage_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create triage records"
  ON public.triage_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update triage records"
  ON public.triage_records FOR UPDATE
  TO authenticated
  USING (true);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_triage_records
  BEFORE UPDATE ON public.triage_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'triage_professional')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();