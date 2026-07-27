ALTER TABLE insurance_leads 
ADD COLUMN IF NOT EXISTS "assignedTo" text,
ADD COLUMN IF NOT EXISTS "travelDate" text,
ADD COLUMN IF NOT EXISTS "visaCategory" text,
ADD COLUMN IF NOT EXISTS "eventDate" text,
ADD COLUMN IF NOT EXISTS "avatar" text;
