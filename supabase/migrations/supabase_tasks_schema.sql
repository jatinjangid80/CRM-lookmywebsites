-- Drop existing tables if they exist to apply the new schema cleanly
DROP TABLE IF EXISTS task_activity CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_number SERIAL,
    title TEXT NOT NULL,
    description TEXT,
    customer_id TEXT,
    booking_id TEXT,
    task_type TEXT DEFAULT 'Individual',
    parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    assigned_to TEXT,
    created_by TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    progress INTEGER DEFAULT 0,
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_comments table
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_activity table
CREATE TABLE task_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    performed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) if not already configured globally, 
-- but we will default to fully permissive policies for development.
-- (Adjust these in your Supabase dashboard for production security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON tasks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON task_comments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON task_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON task_comments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON task_comments FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON task_activity FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON task_activity FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON task_activity FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON task_activity FOR DELETE USING (true);
