-- ============================================================
-- Visa Section Tables for CRM - LookMyHolidays
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create visa_apps table (matches exact Supabase schema provided)
-- NOTE: phone and email are packed inside docs JSONB by the app
CREATE TABLE IF NOT EXISTS public.visa_apps (
  id text NOT NULL,
  customer text NOT NULL,
  avatar text NULL,
  country text NOT NULL,
  flag text NULL,
  "visaType" text NOT NULL,
  "appliedOn" text NULL,
  "travelDate" text NULL,
  status text NOT NULL,
  "embassyRef" text NULL,
  docs jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT visa_apps_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE public.visa_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on visa_apps" ON public.visa_apps FOR ALL USING (true) WITH CHECK (true);

-- ============================================================

-- 2. Create visa_requirements table
CREATE TABLE IF NOT EXISTS public.visa_requirements (
  id text NOT NULL,
  country text NOT NULL,
  "visaType" text NOT NULL,
  docs jsonb NULL DEFAULT '[]'::jsonb,
  "formUrls" jsonb NULL DEFAULT '[]'::jsonb,
  currency text NULL,
  "visaFees" numeric NULL DEFAULT 0,
  "vfsFees" numeric NULL DEFAULT 0,
  "otherFees" numeric NULL DEFAULT 0,
  "serviceFees" numeric NULL DEFAULT 0,
  "consulateFees" numeric NULL DEFAULT 0,
  "urgentFees" numeric NULL DEFAULT 0,
  "urgentFees2" numeric NULL DEFAULT 0,
  "extraName1" text NULL,
  "extraFees1" numeric NULL DEFAULT 0,
  "extraName2" text NULL,
  "extraFees2" numeric NULL DEFAULT 0,
  "extraName3" text NULL,
  "extraFees3" numeric NULL DEFAULT 0,
  "timeRequired" text NULL,
  remark1 text NULL,
  remark2 text NULL,
  remark3 text NULL,
  "supportFiles" jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT visa_requirements_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE public.visa_requirements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on visa_requirements" ON public.visa_requirements FOR ALL USING (true) WITH CHECK (true);
