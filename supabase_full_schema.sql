-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  appointment_date timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL,
  appointment_type text NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);

CREATE TABLE IF NOT EXISTS public.stores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  slug text,
  url text,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_active timestamp with time zone,
  CONSTRAINT stores_pkey PRIMARY KEY (id)
  -- CONSTRAINT stores_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.service_users(id) -- Circular dependency if service_users not created yet
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  total_price numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);

CREATE TABLE IF NOT EXISTS public.order_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  store_id uuid NOT NULL,
  product_name text NOT NULL,
  sku text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL,
  currency text NOT NULL,
  line_total numeric DEFAULT ((quantity)::numeric * unit_price),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT order_products_pkey PRIMARY KEY (id),
  CONSTRAINT order_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);

CREATE TABLE IF NOT EXISTS public.service_users (
  id uuid NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  store_id uuid,
  name text, -- Added name field
  CONSTRAINT service_users_pkey PRIMARY KEY (id),
  CONSTRAINT service_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT service_users_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);

-- Add foreign key for stores.owner_id now that service_users exists
-- ALTER TABLE public.stores ADD CONSTRAINT stores_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.service_users(id);

CREATE TABLE IF NOT EXISTS public.store_stats (
  store_id uuid NOT NULL,
  total_revenue numeric NOT NULL DEFAULT 0,
  total_orders integer NOT NULL DEFAULT 0,
  total_products_sold integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT store_stats_pkey PRIMARY KEY (store_id),
  CONSTRAINT store_stats_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);

CREATE TABLE IF NOT EXISTS public.user_carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_carts_pkey PRIMARY KEY (id),
  CONSTRAINT user_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.website_builder_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL UNIQUE, -- Added UNIQUE constraint
  plan_name text NOT NULL,
  plan_interval text NOT NULL DEFAULT 'monthly'::text,
  plan_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  is_active boolean NOT NULL DEFAULT true,
  billing_started_at timestamp with time zone NOT NULL DEFAULT now(),
  billing_ended_at timestamp with time zone,
  total_revenue numeric NOT NULL DEFAULT 0,
  last_payment_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT website_builder_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT website_builder_subscriptions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.service_users(id)
);
