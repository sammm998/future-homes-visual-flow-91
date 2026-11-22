CREATE TABLE public.inbox_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL DEFAULT 'whatsapp',
  contact_handle text NOT NULL,
  contact_name text,
  lead_id uuid,
  assigned_to uuid,
  status text NOT NULL DEFAULT 'open',
  unread_count integer NOT NULL DEFAULT 0,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  last_inbound_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (channel, contact_handle)
);
CREATE TABLE public.inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.inbox_conversations(id) ON DELETE CASCADE,
  direction text NOT NULL,
  body text NOT NULL DEFAULT '',
  media jsonb,
  provider_message_id text UNIQUE,
  status text NOT NULL DEFAULT 'accepted',
  status_at timestamptz,
  status_times jsonb NOT NULL DEFAULT '{}'::jsonb,
  error jsonb,
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inbox_messages_conv_idx ON public.inbox_messages(conversation_id, created_at);
CREATE TABLE public.whatsapp_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX whatsapp_events_pending_idx ON public.whatsapp_webhook_events(next_attempt_at) WHERE processed_at IS NULL;

CREATE SEQUENCE public.quote_no_seq START 1001;
CREATE SEQUENCE public.invoice_no_seq START 1001;
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_no text NOT NULL UNIQUE DEFAULT ('Q-' || to_char(now(),'YYYY') || '-' || nextval('public.quote_no_seq')),
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  lead_id uuid,
  client_name text NOT NULL DEFAULT '',
  client_email text,
  property_ref text,
  unit_type text,
  currency text NOT NULL DEFAULT 'EUR',
  discount_pct numeric NOT NULL DEFAULT 0,
  payment_plan text,
  notes text,
  valid_until date,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  qty numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0
);
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE DEFAULT ('FHI-' || to_char(now(),'YYYY') || '-' || nextval('public.invoice_no_seq')),
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  client_name text NOT NULL DEFAULT '',
  client_email text,
  description text,
  currency text NOT NULL DEFAULT 'EUR',
  amount numeric NOT NULL DEFAULT 0,
  issue_date date NOT NULL DEFAULT current_date,
  due_date date,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.invoice_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  paid_at date NOT NULL DEFAULT current_date,
  method text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.signature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24),'hex'),
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  signer_name text NOT NULL,
  signer_email text,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  signed_at timestamptz,
  signed_name text,
  signature_png text,
  signer_ip text,
  signer_ua text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  filename text NOT NULL,
  mime text,
  size_bytes bigint,
  lead_id uuid,
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  property_ref text,
  tags text[] NOT NULL DEFAULT '{}',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inbox_conversations, public.inbox_messages, public.quotes, public.quote_items, public.invoices, public.invoice_payments, public.signature_requests, public.documents TO authenticated;
GRANT SELECT ON public.whatsapp_webhook_events TO authenticated;
GRANT ALL ON public.inbox_conversations, public.inbox_messages, public.whatsapp_webhook_events, public.quotes, public.quote_items, public.invoices, public.invoice_payments, public.signature_requests, public.documents TO service_role;
GRANT USAGE ON SEQUENCE public.quote_no_seq, public.invoice_no_seq TO authenticated, service_role;

ALTER TABLE public.inbox_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins manage" ON public.inbox_conversations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.inbox_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins read" ON public.whatsapp_webhook_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.quote_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.invoice_payments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.signature_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER quotes_updated BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "admins read crm docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'crm-documents' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins insert crm docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'crm-documents' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update crm docs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'crm-documents' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete crm docs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'crm-documents' AND public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_messages;