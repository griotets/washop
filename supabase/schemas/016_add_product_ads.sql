-- Create table for storing generated ads
CREATE TABLE IF NOT EXISTS public.product_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  
  platform TEXT NOT NULL, -- facebook, instagram, whatsapp, etc.
  tone TEXT, -- professional, fun, etc.
  
  content_text TEXT,
  image_url TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb, -- Store extra generation params if needed
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_ads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view ads for their stores" ON public.product_ads
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE enterprise_id IN (
        SELECT id FROM public.enterprises WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert ads for their stores" ON public.product_ads
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE enterprise_id IN (
        SELECT id FROM public.enterprises WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete ads for their stores" ON public.product_ads
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE enterprise_id IN (
        SELECT id FROM public.enterprises WHERE owner_id = auth.uid()
      )
    )
  );
