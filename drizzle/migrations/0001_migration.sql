CREATE TABLE public.alert_cron_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  secret text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.alert_cron_config TO service_role;
REVOKE ALL ON public.alert_cron_config FROM anon, authenticated;
ALTER TABLE public.alert_cron_config ENABLE ROW LEVEL SECURITY;
INSERT INTO public.alert_cron_config (id) VALUES (1) ON CONFLICT DO NOTHING;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;