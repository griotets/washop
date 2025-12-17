-- Allow public to create orders
CREATE POLICY orders_public_insert ON public.orders
  FOR INSERT WITH CHECK (true);

-- Allow public to view orders (for confirmation page)
CREATE POLICY orders_public_select ON public.orders
  FOR SELECT USING (true);

-- Allow public to create order items
CREATE POLICY order_items_public_insert ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Allow public to view order items
CREATE POLICY order_items_public_select ON public.order_items
  FOR SELECT USING (true);
