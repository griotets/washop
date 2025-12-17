-- Add checkout_enabled and is_active columns to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS checkout_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
