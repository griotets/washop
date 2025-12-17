-- Add description and currency columns to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XAF';
