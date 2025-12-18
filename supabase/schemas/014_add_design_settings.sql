-- Add design_settings column to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS design_settings JSONB DEFAULT '{}'::jsonb;
