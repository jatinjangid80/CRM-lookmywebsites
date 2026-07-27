DO $$
DECLARE
    t_name text;
    tables text[] := ARRAY[
        'insurance_leads', 'insurance_companies', 'insurance_vendors', 'insurance_policies', 
        'leads', 'employees', 'hr_files', 'assets', 'attendance', 'certificates', 
        'feeds', 'leaves', 'payroll', 'tasks', 'bookings', 'reviews', 'settings', 
        'timelogs', 'packages', 'vendors', 'folders', 'customers', 'payment_requests'
    ];
BEGIN
    FOREACH t_name IN ARRAY tables
    LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t_name);
        
        -- Drop existing generic policy if it exists to avoid conflicts
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS "Allow all access to %I" ON public.%I;', t_name, t_name);
        EXCEPTION WHEN OTHERS THEN END;
        
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS "Allow all access" ON public.%I;', t_name);
        EXCEPTION WHEN OTHERS THEN END;

        -- Create a new policy that allows all operations (to keep your app working)
        EXECUTE format('CREATE POLICY "Allow all access to %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', t_name, t_name);
    END LOOP;
END
$$;
