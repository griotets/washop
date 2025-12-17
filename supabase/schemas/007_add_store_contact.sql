-- Add email and address columns to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS address TEXT;
