-- Add new fields to insurance_vendors table
ALTER TABLE public.insurance_vendors ADD COLUMN IF NOT EXISTS alternate_mobile text;
ALTER TABLE public.insurance_vendors ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.insurance_vendors ADD COLUMN IF NOT EXISTS gst_number text;
ALTER TABLE public.insurance_vendors ADD COLUMN IF NOT EXISTS pan_number text;
ALTER TABLE public.insurance_vendors ADD COLUMN IF NOT EXISTS category text;
