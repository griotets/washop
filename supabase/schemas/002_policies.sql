-- Enable RLS
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_log ENABLE ROW LEVEL SECURITY;

-- Helper policies: only enterprise owner can manage their data
-- Enterprises: owner can select/modify their enterprise
CREATE POLICY enterprises_owner_select ON public.enterprises
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY enterprises_owner_modify ON public.enterprises
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Stores: join to enterprises => same owner
CREATE POLICY stores_owner_select ON public.stores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
  );
CREATE POLICY stores_owner_modify ON public.stores
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = enterprise_id AND e.owner_id = auth.uid())
  );

-- Categories, Tags, Products: scoped by store ownership
CREATE POLICY categories_owner_all ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);
CREATE POLICY tags_owner_all ON public.tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);
CREATE POLICY products_owner_all ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);

-- Variants & Options: scoped via product ownership
CREATE POLICY variants_owner_all ON public.variants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE p.id = product_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE p.id = product_id AND e.owner_id = auth.uid())
);
CREATE POLICY options_owner_all ON public.options FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE p.id = product_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE p.id = product_id AND e.owner_id = auth.uid())
);

-- Clients, Orders: scoped via store ownership
CREATE POLICY clients_owner_all ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);
CREATE POLICY orders_owner_all ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);

-- Order items: scoped via order ownership
CREATE POLICY order_items_owner_all ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE o.id = order_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id JOIN public.enterprises e ON e.id = s.enterprise_id WHERE o.id = order_id AND e.owner_id = auth.uid())
);

-- Delivery zones: scoped via store ownership
CREATE POLICY delivery_zones_owner_all ON public.delivery_zones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);

-- Analytics log: allow insert by owner; public read not enabled here
CREATE POLICY analytics_log_owner_all ON public.analytics_log FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s JOIN public.enterprises e ON e.id = s.enterprise_id WHERE s.id = store_id AND e.owner_id = auth.uid())
);

-- Public read policies for storefront (anonymous) on products if visible
CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (is_visible = TRUE);

