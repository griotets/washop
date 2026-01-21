
-- Ensure product-images bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure store-images bucket exists (if we ever use it)
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-images', 'store-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for product-images
-- Allow public read
CREATE POLICY "Public Read product-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated upload
CREATE POLICY "Auth Upload product-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow owner update/delete (simplified, assumes auth user is owner of their objects or based on path conventions if needed)
-- For now, allow auth users to update/delete their own uploads if path contains their ID? 
-- Or just allow auth users to manage objects in this bucket for simplicity in this migration context.
CREATE POLICY "Auth Manage product-images"
ON storage.objects FOR ALL
USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' )
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );


-- Policies for store-images
CREATE POLICY "Public Read store-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'store-images' );

CREATE POLICY "Auth Upload store-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'store-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Manage store-images"
ON storage.objects FOR ALL
USING ( bucket_id = 'store-images' AND auth.role() = 'authenticated' )
WITH CHECK ( bucket_id = 'store-images' AND auth.role() = 'authenticated' );
