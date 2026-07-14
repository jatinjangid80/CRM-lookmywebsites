-- Create the visa_apps table
CREATE TABLE IF NOT EXISTS public.visa_apps (
    id text PRIMARY KEY,
    customer text NOT NULL,
    phone text,
    email text,
    avatar text,
    country text,
    flag text,
    "visaType" text,
    "appliedOn" text,
    "travelDate" text,
    status text,
    "embassyRef" text,
    docs jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.visa_apps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Enable all for authenticated users" ON public.visa_apps FOR ALL USING (true);
