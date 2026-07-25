-- Schema for General Insurance Leads (insurance_leads)
-- This table is completely separate from the main 'leads' table to avoid mixing booking/travel leads with insurance.

CREATE TABLE IF NOT EXISTS public.insurance_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic Lead Info
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT,
    destination TEXT,
    
    -- Status & Financials
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'New Lead',
    budget NUMERIC DEFAULT 0,
    
    -- JSON blobs for CRM extra fields
    notes JSONB DEFAULT '{}'::jsonb,
    "allNotes" JSONB DEFAULT '[]'::jsonb,
    
    -- Common Follow up / Meta
    "noteDate" TEXT,
    dob TEXT,
    relationship TEXT,
    
    -- Additional fields to match ExtLead interface
    service TEXT DEFAULT 'General Insurance',
    assignedTo TEXT
);

-- Enable RLS
ALTER TABLE public.insurance_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (assuming standard setup used in this app)
CREATE POLICY "Enable read access for all users" ON public.insurance_leads FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.insurance_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.insurance_leads FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.insurance_leads FOR DELETE USING (true);
