CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- VIP members
CREATE TABLE public.vip_profiles (
  user_id uuid PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  language text NOT NULL DEFAULT 'en',
  email_alerts boolean NOT NULL DEFAULT true,
  whatsapp_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_profiles TO authenticated;
GRANT ALL ON public.vip_profiles TO service_role;
ALTER TABLE public.vip_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.vip_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read profiles" ON public.vip_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER vip_profiles_updated BEFORE UPDATE ON public.vip_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_vip() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.vip_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_vip();

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id text NOT NULL,
  ref_no text,
  title text,
  price_at_save text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read favorites" ON public.favorites FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My search',
  city text,
  property_type text,
  max_price numeric,
  min_bedrooms integer,
  keywords text,
  notify_email boolean NOT NULL DEFAULT true,
  notify_whatsapp boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_searches TO authenticated;
GRANT ALL ON public.saved_searches TO service_role;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own searches" ON public.saved_searches FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read searches" ON public.saved_searches FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.alert_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  search_id uuid,
  property_id text NOT NULL,
  kind text NOT NULL DEFAULT 'match',
  channel text NOT NULL,
  price_seen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id, kind, channel, price_seen)
);
GRANT SELECT ON public.alert_deliveries TO authenticated;
GRANT ALL ON public.alert_deliveries TO service_role;
ALTER TABLE public.alert_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own deliveries" ON public.alert_deliveries FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.early_access_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text,
  description text,
  image_url text,
  price_from text,
  launch_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.early_access_projects TO authenticated;
GRANT ALL ON public.early_access_projects TO service_role;
ALTER TABLE public.early_access_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read early access" ON public.early_access_projects FOR SELECT TO authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage early access" ON public.early_access_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Partners
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  company text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  partner_type text NOT NULL DEFAULT 'agent',
  country text,
  website text,
  status text NOT NULL DEFAULT 'pending',
  ref_code text NOT NULL UNIQUE DEFAULT lower(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  commission_pct numeric NOT NULL DEFAULT 3,
  terms_accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partner reads own" ON public.partners FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partner applies" ON public.partners FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending' AND commission_pct = 3);
CREATE POLICY "admins update partners" ON public.partners FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  client_name text,
  client_email text,
  client_phone text,
  source text,
  status text NOT NULL DEFAULT 'new',
  agreed_commission_pct numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.partner_referrals TO authenticated;
GRANT ALL ON public.partner_referrals TO service_role;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partner reads own referrals" ON public.partner_referrals FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.user_id = auth.uid())
);
CREATE POLICY "approved partner registers client" ON public.partner_referrals FOR INSERT TO authenticated WITH CHECK (
  status = 'new' AND EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.user_id = auth.uid() AND p.status = 'approved')
);
CREATE POLICY "admins update referrals" ON public.partner_referrals FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER partner_referrals_updated BEFORE UPDATE ON public.partner_referrals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();