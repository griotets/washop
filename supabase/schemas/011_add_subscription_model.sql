-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'XAF',
  max_products INTEGER, -- NULL means unlimited
  max_stores INTEGER DEFAULT 1,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID REFERENCES public.enterprises(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES public.subscription_plans(id) NOT NULL,
  status TEXT DEFAULT 'active', -- active, trial, past_due, canceled
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enterprise_id)
);

-- Insert default plans
INSERT INTO public.subscription_plans (id, name, price, max_products, max_stores, features) VALUES
('free', 'Gratuit', 0, 20, 1, '["commandes_whatsapp_illimitees", "sous_domaine"]'),
('premium', 'Premium', 5000, NULL, 1, '["produits_illimites", "statistiques_avancees", "promo_codes", "crm_export", "support_prioritaire"]'),
('business', 'Business', 25000, NULL, 3, '["domaine_personnalise", "multi_magasins", "white_label"]')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  max_products = EXCLUDED.max_products,
  max_stores = EXCLUDED.max_stores,
  features = EXCLUDED.features;

-- Function to check product limit
CREATE OR REPLACE FUNCTION public.check_product_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
  store_enterprise_id UUID;
  plan_limit INTEGER;
BEGIN
  -- Get enterprise_id from store
  SELECT enterprise_id INTO store_enterprise_id FROM public.stores WHERE id = NEW.store_id;
  
  -- Get max_products from active subscription
  SELECT p.max_products INTO max_allowed
  FROM public.subscriptions s
  JOIN public.subscription_plans p ON s.plan_id = p.id
  WHERE s.enterprise_id = store_enterprise_id
  AND s.status = 'active';

  -- If no active subscription found, default to 'free' plan limit
  IF NOT FOUND OR max_allowed IS NULL THEN
     -- Check if explicit NULL (unlimited) was returned or if no row was found
     -- If no row found, max_allowed is NULL. If row found and max_products is NULL, max_allowed is NULL.
     -- We need to distinguish.
     
     -- Let's try to fetch the plan directly if subscription exists
     IF EXISTS (SELECT 1 FROM public.subscriptions WHERE enterprise_id = store_enterprise_id AND status = 'active') THEN
        -- Subscription exists, so NULL means unlimited.
        RETURN NEW;
     ELSE
        -- No subscription, use free plan limit
        SELECT max_products INTO max_allowed FROM public.subscription_plans WHERE id = 'free';
     END IF;
  END IF;

  -- If max_allowed is NULL (unlimited), return
  IF max_allowed IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check current count
  SELECT COUNT(*) INTO current_count FROM public.products WHERE store_id = NEW.store_id;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Plan limit reached (% products). Upgrade to add more.', max_allowed;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS enforce_product_limit ON public.products;
CREATE TRIGGER enforce_product_limit
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.check_product_limit();
