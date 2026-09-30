-- ====================================================================
-- HOMELI SUPER APP - SCHEMA COMPLETO DE PRODUCCIÓN PARA SUPABASE
-- Arquitectura de Marketplace estilo Mercado Libre:
-- 1. Billetera y Custodia Escrow (Saldo Retenido vs. Disponible)
-- 2. Termómetro de Reputación de Vendedor (Platinum, Gold, Silver)
-- 3. Guía de Envío MercadoEnvíos y Tracking en Tiempo Real
-- 4. Chat Post-Venta Directo entre Comprador y Vendedor
-- 5. Calificaciones y Reseñas de Compradores Verificados
-- 6. Garantía de Compra Protegida y Disputas con Reembolso Automático
-- 7. Retiros Bancarios a Cuentas CLABE / SPEI
-- ====================================================================

-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpieza controlada si se re-ejecuta
DROP TABLE IF EXISTS public.order_messages CASCADE;
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.disputes CASCADE;
DROP TABLE IF EXISTS public.merchant_payouts CASCADE;
DROP TABLE IF EXISTS public.order_tracking_events CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.merchants CASCADE;
DROP TABLE IF EXISTS public.service_bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.ads_campaigns CASCADE;
DROP TABLE IF EXISTS public.wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- --------------------------------------------------------------------
-- 1. TABLA DE PERFILES DE USUARIOS (Clientes, Repartidores, Admins)
-- --------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'B2C' CHECK (role IN ('B2C', 'B2B', 'DRIVER', 'ADMIN')),
  avatar_url TEXT,
  city TEXT DEFAULT 'Puebla, México',
  wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
  homeli_points INT DEFAULT 0,
  addresses JSONB DEFAULT '[]'::jsonb,
  is_kyc_verified BOOLEAN DEFAULT false,
  kyc_doc_type TEXT,
  kyc_doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. TABLA DE COMERCIOS / VENDEDORES (Termómetro de Reputación y Escrow)
-- --------------------------------------------------------------------
CREATE TABLE public.merchants (
  id TEXT PRIMARY KEY, -- e.g. 'm-101'
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  legal_name TEXT,
  rfc TEXT,
  logo_url TEXT,
  banner_url TEXT,
  reputation_level TEXT DEFAULT 'gold' CHECK (reputation_level IN ('platinum', 'gold', 'silver', 'rookie')),
  level_label TEXT DEFAULT 'MercadoLíder Gold 🥇',
  on_time_dispatch_percent NUMERIC(5, 2) DEFAULT 98.00,
  complaint_rate_percent NUMERIC(5, 2) DEFAULT 0.40,
  cancellation_rate_percent NUMERIC(5, 2) DEFAULT 0.20,
  completed_sales_60_days INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  -- Saldos Financieros
  escrow_balance NUMERIC(12, 2) DEFAULT 0.00, -- Dinero retenido en custodia por pedidos en tránsito
  available_balance NUMERIC(12, 2) DEFAULT 0.00, -- Dinero liberado disponible para retiro
  bank_name TEXT,
  clabe_number TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. TABLA DE PRODUCTOS (Marketplace 3D WebAR)
-- --------------------------------------------------------------------
CREATE TABLE public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substring(md5(random()::text) from 1 for 8)),
  merchant_id TEXT NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.00,
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

-- --------------------------------------------------------------------
-- 4. TABLA DE PEDIDOS (Flujo MercadoLibre con Escrow y Guía de Rastreo)
-- --------------------------------------------------------------------
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ORD-' || floor(1000 + random() * 9000)::text),
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT NOT NULL,
  merchant_id TEXT NOT NULL REFERENCES public.merchants(id) ON DELETE RESTRICT,
  merchant_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 45.00,
  status TEXT DEFAULT 'Nuevo' CHECK (status IN ('Nuevo', 'En preparación', 'Listo para recolección', 'En camino', 'Entregado', 'Cancelado', 'En disputa')),
  -- Campos MercadoLibre
  tracking_number TEXT NOT NULL UNIQUE DEFAULT ('HML-TRK-' || floor(100000 + random() * 900000)::text || 'MX'),
  escrow_status TEXT DEFAULT 'in_escrow' CHECK (escrow_status IN ('in_escrow', 'released', 'refunded', 'disputed')),
  escrow_amount NUMERIC(10, 2) NOT NULL,
  driver_id TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  driver_lat NUMERIC(9, 6),
  driver_lng NUMERIC(9, 6),
  invoice_type TEXT DEFAULT 'Boleta' CHECK (invoice_type IN ('Boleta', 'Factura')),
  tax_id TEXT,
  qr_code_token TEXT,
  proof_signature TEXT,
  proof_pin TEXT DEFAULT (floor(1000 + random() * 9000)::text),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. TABLA DE EVENTOS DE GUÍA Y RASTREO (Tracking Stepper)
-- --------------------------------------------------------------------
CREATE TABLE public.order_tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  milestone_title TEXT NOT NULL,
  milestone_location TEXT,
  is_done BOOLEAN DEFAULT false,
  event_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. TABLA DE MENSAJES DE CHAT POST-VENTA (Comprador - Vendedor)
-- --------------------------------------------------------------------
CREATE TABLE public.order_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('B2C', 'B2B', 'DRIVER', 'ADMIN')),
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. TABLA DE RESEÑAS Y CALIFICACIONES DE COMPRADORES VERIFICADOS
-- --------------------------------------------------------------------
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photo_url TEXT,
  is_verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. TABLA DE RECLAMOS Y DISPUTAS (Garantía de Compra Protegida)
-- --------------------------------------------------------------------
CREATE TABLE public.disputes (
  id TEXT PRIMARY KEY DEFAULT ('DSP-' || floor(100 + random() * 900)::text),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  merchant_id TEXT NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  evidence_photo_url TEXT,
  status TEXT DEFAULT 'Abierto' CHECK (status IN ('Abierto', 'En Mediación', 'Resuelto con Reembolso', 'Cerrado a Favor de Vendedor')),
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- --------------------------------------------------------------------
-- 9. TABLA DE RETIROS BANCARIOS (Payouts de Vendedores a CLABE)
-- --------------------------------------------------------------------
CREATE TABLE public.merchant_payouts (
  id TEXT PRIMARY KEY DEFAULT ('pay-' || substring(md5(random()::text) from 1 for 8)),
  merchant_id TEXT NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  bank_name TEXT NOT NULL,
  clabe_number TEXT NOT NULL,
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Procesado', 'Rechazado')),
  reference_number TEXT NOT NULL DEFAULT ('SPEI-HML-' || floor(100000 + random() * 900000)::text),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- --------------------------------------------------------------------
-- 10. TABLA DE MOVIMIENTOS DE BILLETERA (Historial Financiero)
-- --------------------------------------------------------------------
CREATE TABLE public.wallet_transactions (
  id TEXT PRIMARY KEY DEFAULT ('tx-' || substring(md5(random()::text) from 1 for 8)),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('topup', 'payment', 'transfer', 'reward', 'cashout', 'refund', 'escrow_release')),
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Completado' CHECK (status IN ('Completado', 'Pendiente', 'Cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. TABLA DE SERVICIOS RESIDENCIALES Y RESERVAS
-- --------------------------------------------------------------------
CREATE TABLE public.services (
  id TEXT PRIMARY KEY DEFAULT ('srv-' || substring(md5(random()::text) from 1 for 8)),
  provider_id TEXT NOT NULL DEFAULT 'p-1',
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

CREATE TABLE public.service_bookings (
  id TEXT PRIMARY KEY DEFAULT ('BKG-' || floor(100 + random() * 900)::text),
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

-- --------------------------------------------------------------------
-- 12. TABLA DE COMUNIDAD SOCIAL Y ANUNCIOS
-- --------------------------------------------------------------------
CREATE TABLE public.posts (
  id TEXT PRIMARY KEY DEFAULT ('post-' || substring(md5(random()::text) from 1 for 8)),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT DEFAULT 'Vecino Verificado',
  content TEXT NOT NULL,
  image TEXT,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'Pregunta local',
  is_sponsored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ads_campaigns (
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

CREATE TABLE public.system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  marketplace_commission_percent NUMERIC(5, 2) DEFAULT 8.50,
  service_commission_percent NUMERIC(5, 2) DEFAULT 12.00,
  delivery_base_fee NUMERIC(6, 2) DEFAULT 35.00,
  delivery_fee_per_km NUMERIC(6, 2) DEFAULT 12.00,
  ads_cpc_rate NUMERIC(6, 2) DEFAULT 3.50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 13. PROCEDIMIENTO ALMACENADO: LIBERAR FONDOS DE ESCROW AL ENTREGAR
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.confirm_order_delivery_procedure(p_order_id TEXT)
RETURNS VOID AS $$
DECLARE
  v_merchant_id TEXT;
  v_escrow_amount NUMERIC(10, 2);
  v_commission_rate NUMERIC(5, 2);
  v_net_seller_amount NUMERIC(10, 2);
BEGIN
  -- Obtener orden y monto
  SELECT merchant_id, escrow_amount INTO v_merchant_id, v_escrow_amount
  FROM public.orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orden % no encontrada', p_order_id;
  END IF;

  -- Obtener tasa de comisión
  SELECT marketplace_commission_percent INTO v_commission_rate FROM public.system_settings WHERE id = 1;
  IF v_commission_rate IS NULL THEN
    v_commission_rate := 8.50;
  END IF;

  v_net_seller_amount := v_escrow_amount * (1.0 - (v_commission_rate / 100.0));

  -- 1. Actualizar orden
  UPDATE public.orders
  SET status = 'Entregado',
      escrow_status = 'released',
      delivered_at = NOW()
  WHERE id = p_order_id;

  -- 2. Descontar de Escrow y Acreditar Saldo Disponible al Vendedor
  UPDATE public.merchants
  SET escrow_balance = GREATEST(0, escrow_balance - v_escrow_amount),
      available_balance = available_balance + v_net_seller_amount,
      completed_sales_60_days = completed_sales_60_days + 1
  WHERE id = v_merchant_id;

  -- 3. Registrar mensaje en el chat post-venta
  INSERT INTO public.order_messages (order_id, sender_id, sender_name, sender_role, text)
  VALUES (
    p_order_id,
    'SYSTEM',
    'Sistema Homeli Compra Protegida',
    'ADMIN',
    'Entrega completada exitosamente. Fondos liberados al saldo disponible del vendedor.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 14. SEGURIDAD Y PERMISOS (ROW LEVEL SECURITY - RLS)
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para catálogo y perfiles comerciales
CREATE POLICY "Lectura pública comercios" ON public.merchants FOR SELECT USING (true);
CREATE POLICY "Lectura pública productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Lectura pública servicios" ON public.services FOR SELECT USING (true);
CREATE POLICY "Lectura pública reseñas" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Lectura pública posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Lectura pública anuncios" ON public.ads_campaigns FOR SELECT USING (true);
CREATE POLICY "Lectura pública settings" ON public.system_settings FOR SELECT USING (true);

-- Políticas de pedidos y operaciones
CREATE POLICY "Acceso pedidos" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso eventos tracking" ON public.order_tracking_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso chat pedidos" ON public.order_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso reseñas" ON public.product_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso disputas" ON public.disputes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso payouts" ON public.merchant_payouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso wallet" ON public.wallet_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso perfiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso reservas" ON public.service_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso productos" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso comercios" ON public.merchants FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 15. DATOS SEMILLA INICIALES (SEED DATA DE PRODUCCIÓN)
-- --------------------------------------------------------------------
INSERT INTO public.system_settings (id, marketplace_commission_percent, service_commission_percent, delivery_base_fee, delivery_fee_per_km, ads_cpc_rate)
VALUES (1, 8.50, 12.00, 35.00, 12.00, 3.50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.merchants (id, name, legal_name, rfc, reputation_level, level_label, on_time_dispatch_percent, complaint_rate_percent, cancellation_rate_percent, completed_sales_60_days, rating, escrow_balance, available_balance, bank_name, clabe_number)
VALUES
('m-101', 'EcoClean Insumos', 'EcoClean Insumos S.A. de C.V.', 'ECO1809028X1', 'platinum', 'MercadoLíder Platinum 🏅', 98.60, 0.30, 0.20, 480, 4.95, 1250.00, 8450.00, 'BBVA Bancomer', '012680015489201934'),
('m-102', 'Detergentes Pro MX', 'Detergentes Industriales y del Hogar S.A.', 'DPR1904128X9', 'gold', 'MercadoLíder Gold 🥇', 96.20, 0.80, 0.50, 290, 4.88, 780.00, 4620.00, 'Santander', '014680019234857102'),
('m-103', 'Limpieza Total Directo', 'Distribuidora Limpieza Total S.A.', 'DLT2001157K2', 'platinum', 'MercadoLíder Platinum 🏅', 99.10, 0.20, 0.10, 520, 4.97, 980.00, 12300.00, 'Banorte', '072680012938475612'),
('m-104', 'Higienix Soluciones', 'Higienix Comercializadora S. de R.L.', 'HIG2105309M3', 'silver', 'Vendedor Destacado Silver 🥈', 94.00, 1.20, 1.00, 140, 4.75, 420.00, 2100.00, 'Citibanamex', '002680018492039485')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, merchant_id, merchant_name, title, description, category, price, original_price, rating, reviews_count, stock, image, has_3d_model, dimensions, is_sponsored)
VALUES 
('prod-1', 'm-101', 'EcoClean Insumos', 'Kit Limpiador Multiusos Biodegradable 3D', 'Fórmula concentrada ecológica cítrica libre de tóxicos. Elimina el 99.9% de bacterias en cubiertas, cristal y acero. Incluye atomizador ergonómico reutilizable.', 'Desinfectantes', 289.00, 350.00, 4.90, 142, 45, 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop', true, '{"width": "12 cm", "height": "28 cm"}'::jsonb, true),
('prod-2', 'm-102', 'Detergentes Pro MX', 'Detergente Líquido Concentrado Hipoalergénico 5L 3D', 'Detergente de alto rendimiento para ropa blanca y de color. Protege fibras delicadas, elimina manchas difíciles sin dañar tejidos.', 'Detergentes', 349.00, 420.00, 4.80, 185, 30, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop', true, '{"width": "20 cm", "height": "38 cm"}'::jsonb, false),
('prod-3', 'm-103', 'Limpieza Total Directo', 'Mopa Giratoria Microfibra Pro con Balde Escurridor 3D', 'Sistema de limpieza de pisos 360° con pedal escurridor de acero inoxidable y manillar telescópico.', 'Utensilios y Mops', 499.00, 650.00, 4.90, 210, 20, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&fit=crop', true, '{"width": "45 cm", "height": "120 cm"}'::jsonb, true),
('prod-4', 'm-104', 'Higienix Soluciones', 'Gel Desinfectante y Sarricida para Baño 1L', 'Potente removedor de sarro, moho y marcas de agua dura en azulejos e inodoros con fragancia refrescante.', 'Limpieza de Baño', 149.00, 180.00, 4.70, 96, 50, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&fit=crop', false, '{"width": "10 cm", "height": "25 cm"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, customer_id, customer_name, customer_phone, delivery_address, merchant_id, merchant_name, items, total_amount, delivery_fee, status, tracking_number, escrow_status, escrow_amount, driver_name)
VALUES
('ORD-9421', 'usr-01', 'Mano Varadhan', '+52 222 628 5414', 'Calle de los Azahares 402, Lomas de Angelópolis, Puebla', 'm-101', 'EcoClean Insumos', '[{"productId": "prod-1", "title": "Kit Limpiador Multiusos Biodegradable 3D", "price": 289, "quantity": 2, "image": "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&fit=crop"}]'::jsonb, 578.00, 45.00, 'En camino', 'HML-TRK-9421MX', 'in_escrow', 578.00, 'Mateo Hernández'),
('ORD-8810', 'usr-01', 'Mano Varadhan', '+52 222 628 5414', 'Calle de los Azahares 402, Lomas de Angelópolis, Puebla', 'm-102', 'Detergentes Pro MX', '[{"productId": "prod-2", "title": "Detergente Líquido Concentrado Hipoalergénico 5L 3D", "price": 349, "quantity": 1, "image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop"}]'::jsonb, 394.00, 45.00, 'Entregado', 'HML-TRK-8810MX', 'released', 349.00, 'Mateo Hernández')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_reviews (product_id, order_id, user_name, rating, comment, is_verified_purchase)
VALUES
('prod-1', 'ORD-8810', 'Valeria R. (Compradora Verificada)', 5, '¡Excelente desinfectante! El atomizador tiene un acabado ergonómico premium. Además la visualización en 3D en la mesa me ayudó a verificar el tamaño.', true),
('prod-2', 'ORD-8810', 'Mano Varadhan', 5, 'Muy rendidor y no daña las prendas. Envío puntual y empaque seguro.', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.order_messages (order_id, sender_id, sender_name, sender_role, text)
VALUES
('ORD-9421', 'm-101', 'EcoClean Insumos (Vendedor)', 'B2B', '¡Hola! Tu pedido de atomizadores desinfectantes ya fue empacado con sello de seguridad biodegradable y va en camino con el repartidor.'),
('ORD-9421', 'usr-01', 'Mano Varadhan (Comprador)', 'B2C', '¡Excelente! Por favor indícale al repartidor que toque el timbre del Depto 402.')
ON CONFLICT DO NOTHING;
