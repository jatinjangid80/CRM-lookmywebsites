-- ============================================================
-- Marketing Section Table for CRM - LookMyHolidays
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id text NOT NULL DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  description text NULL,
  type text NULL,
  status text NULL,
  audience text NULL,
  "sentDate" text NULL,
  "openRate" text NULL,
  "clickRate" text NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on marketing_campaigns" ON public.marketing_campaigns FOR ALL USING (true) WITH CHECK (true);
