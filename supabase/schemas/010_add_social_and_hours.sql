-- Add opening hours and social community links to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS opening_hours_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS social_whatsapp TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS social_telegram TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS social_facebook TEXT;
