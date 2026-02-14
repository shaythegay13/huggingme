
-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  gender TEXT,
  legal_age INT,
  height TEXT,
  skin_type TEXT,
  photos TEXT[] DEFAULT '{}',
  energy_state INT NOT NULL DEFAULT 5 CHECK (energy_state >= 1 AND energy_state <= 10),
  credits INT NOT NULL DEFAULT 10,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  bio TEXT,
  location TEXT,
  max_distance INT DEFAULT 50,
  available_today BOOLEAN NOT NULL DEFAULT false,
  languages TEXT[] DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- OFFERS TABLE
-- =============================================
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  interaction_type TEXT NOT NULL DEFAULT 'hug',
  sender_energy_state INT,
  receiver_energy_state INT,
  energy_differential INT,
  credits_offered INT NOT NULL DEFAULT 1,
  location_offered TEXT,
  preferred_times TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  CONSTRAINT no_self_offers CHECK (sender_id != receiver_id)
);

-- =============================================
-- SCHEDULE SETTINGS TABLE
-- =============================================
CREATE TABLE public.schedule_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_settings_updated_at
  BEFORE UPDATE ON public.schedule_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ENABLE RLS
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES RLS POLICIES
-- =============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles"
  ON public.profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- OFFERS RLS POLICIES
-- =============================================
CREATE POLICY "Users can view sent offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view received offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can create offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders can update own offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Receivers can update offer status"
  ON public.offers FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete own offers"
  ON public.offers FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- =============================================
-- SCHEDULE SETTINGS RLS POLICIES
-- =============================================
CREATE POLICY "Users can view own schedule"
  ON public.schedule_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule"
  ON public.schedule_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule"
  ON public.schedule_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule"
  ON public.schedule_settings FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_location ON public.profiles(location);
CREATE INDEX idx_offers_sender ON public.offers(sender_id);
CREATE INDEX idx_offers_receiver ON public.offers(receiver_id);
CREATE INDEX idx_offers_status ON public.offers(status);
