ALTER TABLE public.enterprise_billing_settings
  ADD COLUMN IF NOT EXISTS billing_customer JSONB;

