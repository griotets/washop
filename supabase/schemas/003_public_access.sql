-- Enable public read access for storefront components

-- Stores: Allow public to view store details (needed for routing by slug)
CREATE POLICY stores_public_read ON public.stores
  FOR SELECT USING (true);

-- Categories: Allow public to view categories
CREATE POLICY categories_public_read ON public.categories
  FOR SELECT USING (true);

-- Tags: Allow public to view tags
CREATE POLICY tags_public_read ON public.tags
  FOR SELECT USING (true);

-- Variants: Allow public to view product variants
CREATE POLICY variants_public_read ON public.variants
  FOR SELECT USING (true);

-- Options: Allow public to view product options
CREATE POLICY options_public_read ON public.options
  FOR SELECT USING (true);

-- Delivery Zones: Allow public to view delivery zones (for cart calculations)
CREATE POLICY delivery_zones_public_read ON public.delivery_zones
  FOR SELECT USING (true);

-- Ensure products public policy is robust (already exists in 002 but good to verify)
-- Existing: CREATE POLICY products_public_read ON public.products FOR SELECT USING (is_visible = TRUE);
