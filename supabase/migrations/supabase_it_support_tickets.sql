-- Create it_support_tickets table
CREATE TABLE IF NOT EXISTS it_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL,
    module TEXT NOT NULL DEFAULT 'Bookings',
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'Open',
    requester_name TEXT NOT NULL,
    requester_role TEXT DEFAULT 'Employee',
    requester_email TEXT,
    requester_phone TEXT,
    related_reference TEXT,
    steps_to_reproduce TEXT,
    screenshot_url TEXT,
    it_assignee TEXT DEFAULT 'Jatin Jangid (IT Administrator)',
    it_resolution_notes TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    comments JSONB DEFAULT '[]'::jsonb,
    feedback_rating INT,
    feedback_text TEXT,
    feedback_submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure feedback columns exist if table was already created
ALTER TABLE it_support_tickets ADD COLUMN IF NOT EXISTS feedback_rating INT;
ALTER TABLE it_support_tickets ADD COLUMN IF NOT EXISTS feedback_text TEXT;
ALTER TABLE it_support_tickets ADD COLUMN IF NOT EXISTS feedback_submitted_at TIMESTAMP WITH TIME ZONE;

-- Enable Row Level Security (RLS)
ALTER TABLE it_support_tickets ENABLE ROW LEVEL SECURITY;

-- Permissive policies for CRM staff and IT admins
CREATE POLICY "Enable read access for all CRM users" ON it_support_tickets FOR SELECT USING (true);
CREATE POLICY "Enable insert for all CRM users" ON it_support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all CRM users" ON it_support_tickets FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all CRM users" ON it_support_tickets FOR DELETE USING (true);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_it_tickets_status ON it_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_it_tickets_priority ON it_support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_it_tickets_module ON it_support_tickets(module);
CREATE INDEX IF NOT EXISTS idx_it_tickets_requester ON it_support_tickets(requester_name);
