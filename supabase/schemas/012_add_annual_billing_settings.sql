DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_billing_interval_enum') THEN
    CREATE TYPE subscription_billing_interval_enum AS ENUM ('month', 'year');
  END IF;
END$$;
CREATE TABLE IF NOT EXISTS public.enterprise_billing_settings (
  enterprise_id UUID PRIMARY KEY REFERENCES public.enterprises(id) ON DELETE CASCADE,
  annual_discount_percent INTEGER NOT NULL DEFAULT 30 CHECK (annual_discount_percent BETWEEN 0 AND 90),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  updated_by UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS public.enterprise_billing_settings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  old_annual_discount_percent INTEGER,
  new_annual_discount_percent INTEGER NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid()
);

CREATE OR REPLACE FUNCTION public.enterprise_billing_settings_before_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.enterprise_billing_settings_history (
    enterprise_id,
    old_annual_discount_percent,
    new_annual_discount_percent,
    changed_by
  ) VALUES (
    NEW.enterprise_id,
    OLD.annual_discount_percent,
    NEW.annual_discount_percent,
    auth.uid()
  );

  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enterprise_billing_settings_before_update ON public.enterprise_billing_settings;
CREATE TRIGGER trg_enterprise_billing_settings_before_update
BEFORE UPDATE ON public.enterprise_billing_settings
FOR EACH ROW
EXECUTE FUNCTION public.enterprise_billing_settings_before_update();

CREATE TABLE IF NOT EXISTS public.subscription_checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year')),
  currency TEXT NOT NULL DEFAULT 'XAF',
  monthly_price BIGINT NOT NULL,
  annual_discount_percent INTEGER CHECK (annual_discount_percent BETWEEN 0 AND 90),
  annual_price_before BIGINT,
  annual_price_after BIGINT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'canceled', 'expired')),
  provider TEXT,
  provider_reference TEXT,
  payment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  CONSTRAINT subscription_checkout_sessions_year_fields CHECK (
    (billing_interval = 'month' AND annual_discount_percent IS NULL AND annual_price_before IS NULL AND annual_price_after IS NULL)
    OR
    (billing_interval = 'year' AND annual_discount_percent IS NOT NULL AND annual_price_before IS NOT NULL AND annual_price_after IS NOT NULL)
  )
);

CREATE OR REPLACE FUNCTION public.create_subscription_checkout_session(
  p_enterprise_id UUID,
  p_plan_id TEXT,
  p_billing_interval TEXT
)
RETURNS public.subscription_checkout_sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price NUMERIC;
  v_currency TEXT;
  v_monthly BIGINT;
  v_discount INTEGER;
  v_before BIGINT;
  v_after BIGINT;
  v_row public.subscription_checkout_sessions;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.enterprises e WHERE e.id = p_enterprise_id AND e.owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  SELECT sp.price, sp.currency
    INTO v_price, v_currency
  FROM public.subscription_plans sp
  WHERE sp.id = p_plan_id;

  IF v_price IS NULL THEN
    RAISE EXCEPTION 'unknown_plan';
  END IF;

  v_monthly = COALESCE(ROUND(v_price), 0)::BIGINT;

  IF p_billing_interval = 'year' THEN
    SELECT ebs.annual_discount_percent
      INTO v_discount
    FROM public.enterprise_billing_settings ebs
    WHERE ebs.enterprise_id = p_enterprise_id;

    v_discount = COALESCE(v_discount, 30);
    IF v_discount < 0 THEN v_discount = 0; END IF;
    IF v_discount > 90 THEN v_discount = 90; END IF;

    v_before = v_monthly * 12;
    v_after = (v_before * (100 - v_discount) + 50) / 100;

    INSERT INTO public.subscription_checkout_sessions (
      enterprise_id,
      plan_id,
      billing_interval,
      currency,
      monthly_price,
      annual_discount_percent,
      annual_price_before,
      annual_price_after,
      created_by
    ) VALUES (
      p_enterprise_id,
      p_plan_id,
      'year',
      COALESCE(v_currency, 'XAF'),
      v_monthly,
      v_discount,
      v_before,
      v_after,
      auth.uid()
    )
    RETURNING * INTO v_row;
  ELSE
    INSERT INTO public.subscription_checkout_sessions (
      enterprise_id,
      plan_id,
      billing_interval,
      currency,
      monthly_price,
      created_by
    ) VALUES (
      p_enterprise_id,
      p_plan_id,
      'month',
      COALESCE(v_currency, 'XAF'),
      v_monthly,
      auth.uid()
    )
    RETURNING * INTO v_row;
  END IF;

  RETURN v_row;
END;
$$;

ALTER TABLE public.enterprise_billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_billing_settings_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_checkout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS enterprise_billing_settings_owner_all ON public.enterprise_billing_settings;
CREATE POLICY enterprise_billing_settings_owner_all
ON public.enterprise_billing_settings
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
);

DROP POLICY IF EXISTS enterprise_billing_settings_history_owner_all ON public.enterprise_billing_settings_history;
CREATE POLICY enterprise_billing_settings_history_owner_all
ON public.enterprise_billing_settings_history
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
);

DROP POLICY IF EXISTS subscription_checkout_sessions_owner_all ON public.subscription_checkout_sessions;
CREATE POLICY subscription_checkout_sessions_owner_all
ON public.subscription_checkout_sessions
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
);

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS billing_interval subscription_billing_interval_enum NOT NULL DEFAULT 'month',
  ADD COLUMN IF NOT EXISTS billing_discount_percent NUMERIC,
  ADD COLUMN IF NOT EXISTS billing_amount NUMERIC;
