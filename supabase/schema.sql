-- ============================================================
-- DesignDNA — Supabase Database Schema
-- ============================================================
-- Run this file in Supabase Dashboard > SQL Editor
-- Supabase auto-creates `auth.users` — we only create public tables
-- ============================================================

-- ============================================================
-- 1. PROFILES — extends auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles — auto-created on signup via trigger';

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- 2. API_KEYS — user Gemini API keys (encrypted)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  encrypted_key TEXT NOT NULL,
  provider      TEXT DEFAULT 'gemini',
  created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.api_keys IS 'User API keys — encrypted at rest';

-- RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. ANALYSES — saved DNA analysis results
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT,
  thumbnail   TEXT,
  result_json JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.analyses IS 'Saved design analyses (~50-100KB JSONB each)';

-- RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON public.analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Index for listing analyses by user, newest first
CREATE INDEX IF NOT EXISTS idx_analyses_user_created
  ON public.analyses (user_id, created_at DESC);

-- ============================================================
-- 4. PATTERNS — saved compare results
-- ============================================================

CREATE TABLE IF NOT EXISTS public.patterns (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  summary            TEXT,
  source_image_count INTEGER,
  thumbnails         JSONB,
  batch_analysis     JSONB NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.patterns IS 'Saved compare/pattern results';

-- RLS
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patterns"
  ON public.patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns"
  ON public.patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns"
  ON public.patterns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns"
  ON public.patterns FOR DELETE
  USING (auth.uid() = user_id);

-- Index for listing patterns by user, newest first
CREATE INDEX IF NOT EXISTS idx_patterns_user_created
  ON public.patterns (user_id, created_at DESC);

-- ============================================================
-- 5. AUTO-CREATE PROFILE TRIGGER
-- ============================================================
-- When a new user signs up via Supabase Auth, automatically
-- create a corresponding row in public.profiles.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to make script re-runnable
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
