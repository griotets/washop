-- Add details columns to enterprises table
ALTER TABLE public.enterprises
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS employee_count TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Africa/Douala';

-- Allow owner to update their enterprise
CREATE POLICY "Users can update their own enterprise" ON public.enterprises
FOR UPDATE USING (auth.uid() = owner_id);

-- Allow owner to delete their enterprise (if needed, though usually restricted)
CREATE POLICY "Users can delete their own enterprise" ON public.enterprises
FOR DELETE USING (auth.uid() = owner_id);
