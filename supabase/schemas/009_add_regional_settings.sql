-- Add regional settings columns to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Cameroon';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS distance_unit TEXT DEFAULT 'km';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS map_provider TEXT DEFAULT 'osm';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 0;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS tax_inclusive BOOLEAN DEFAULT TRUE;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS tax_id TEXT;
