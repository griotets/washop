-- Add delivery_settings column to stores if it doesn't exist
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS delivery_settings JSONB DEFAULT '{"pickup_enabled": true, "delivery_enabled": true, "delivery_fee": 0}'::jsonb;
