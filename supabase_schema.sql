-- ====================================================================
-- HOMELI SUPER APP - DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)
-- Project: homeli@mexicosignaturetours.com.mx's Project
-- Project ID: ejmuvdsqpbfnqzodxkgg
-- URL: https://ejmuvdsqpbfnqzodxkgg.supabase.co
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'B2C' CHECK (role IN ('B2C', 'B2B', 'DRIVER', 'ADMIN')),
  avatar_url TEXT,
  wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
  homeli_points INT DEFAULT 0,
  addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE (Cleaning Products & 3D WebAR)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substring(md5(random()::text) from 1 for 8)),
  merchant_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  merchant_logo TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  stock INT DEFAULT 10,
  image TEXT,
  has_3d_model BOOLEAN DEFAULT false,
  model_glb_url TEXT,
  model_usdz_url TEXT,
  dimensions JSONB,
  colors JSONB,
  is_sponsored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE (Plumbing, Cleaning, Maintenance, etc.)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT ('srv-' || substring(md5(random()::text) from 1 for 8)),
  provider_id TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  category TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  price_estimate TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  badge_text TEXT,
  is_top_recommended BOOLEAN DEFAULT false,
  response_time TEXT DEFAULT '15-30 min',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (Multi-merchant cart orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || substring(md5(random()::text) from 1 for 8)),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT NOT NULL,
  merchant_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En preparación', 'En camino', 'Entregado', 'Cancelado')),
  driver_id TEXT,
  driver_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id TEXT PRIMARY KEY DEFAULT ('bk-' || substring(md5(random()::text) from 1 for 8)),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_avatar TEXT,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  address TEXT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Programado' CHECK (status IN ('Programado', 'En camino', 'En progreso', 'Completado', 'Cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY DEFAULT ('post-' || substring(md5(random()::text) from 1 for 8)),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT DEFAULT 'Vecino Verificado',
  content TEXT NOT NULL,
  image TEXT,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  is_sponsored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADS CAMPAIGNS TABLE (Homeli Ads)
CREATE TABLE IF NOT EXISTS public.ads_campaigns (
  id TEXT PRIMARY KEY DEFAULT ('ad-' || substring(md5(random()::text) from 1 for 8)),
  merchant_name TEXT NOT NULL,
  title TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  daily_budget NUMERIC(10, 2) NOT NULL,
  spent NUMERIC(10, 2) DEFAULT 0.00,
  target_audience TEXT,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  status TEXT DEFAULT 'Activo' CHECK (status IN ('Activo', 'Pausado', 'Finalizado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_campaigns ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products, services, posts, ads
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public ads are viewable by everyone" ON public.ads_campaigns FOR SELECT USING (true);

-- Allow full access for development and demo mode
CREATE POLICY "Allow anon insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon insert bookings" ON public.service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select bookings" ON public.service_bookings FOR SELECT USING (true);
CREATE POLICY "Allow anon insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update posts" ON public.posts FOR UPDATE USING (true);

-- ====================================================================
-- SEED INITIAL DATA (SAMPLE CLEANING PRODUCTS & SERVICES)
-- ====================================================================

INSERT INTO public.products (id, merchant_id, merchant_name, title, description, category, price, original_price, rating, reviews_count, stock, image, has_3d_model, dimensions, is_sponsored)
VALUES 
('prod-1', 'm-101', 'EcoClean Insumos', 'Kit Limpiador Multiusos Biodegradable 3D', 'Fórmula concentrada ecológica cítrica libre de tóxicos. Elimina el 99.9% de bacterias.', 'Desinfectantes', 289.00, 350.00, 4.90, 142, 45, 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop', true, '{"width": "12 cm", "height": "28 cm"}'::jsonb, true),
('prod-2', 'm-102', 'Detergentes Pro MX', 'Detergente Líquido Concentrado Hipoalergénico 5L 3D', 'Detergente de alto rendimiento para ropa blanca y de color. Protege fibras delicadas.', 'Detergentes', 349.00, 420.00, 4.80, 185, 30, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop', true, '{"width": "20 cm", "height": "38 cm"}'::jsonb, false),
('prod-3', 'm-103', 'Limpieza Total Directo', 'Mopa Giratoria Microfibra Pro con Balde Escurridor 3D', 'Sistema de limpieza de pisos 360° con pedal escurridor de acero inoxidable.', 'Utensilios y Mops', 499.00, 650.00, 4.90, 210, 20, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&fit=crop', true, '{"width": "45 cm", "height": "120 cm"}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, provider_id, name, avatar, category, rating, reviews_count, price_estimate, is_verified, badge_text, is_top_recommended)
VALUES
('srv-1', 'p-1', 'Limpieza Profunda Residencial', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&fit=crop', 'Limpieza', 4.95, 128, '$650 - $1,200 MXN', true, 'Sello Homeli Pro', true),
('srv-2', 'p-2', 'Plomería Express & Detección de Fugas', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&fit=crop', 'Plomería', 4.88, 94, '$350 - $800 MXN', true, 'Sello Verificado', true),
('srv-3', 'p-3', 'Electricista Certificado e Instalación LED', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&fit=crop', 'Electricidad', 4.90, 110, '$400 - $950 MXN', true, 'Urgencias 24/7', false)
ON CONFLICT (id) DO NOTHING;
