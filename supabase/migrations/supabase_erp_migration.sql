-- 1. Ensure 'customers' table has an ID primary key (it should already)
-- ALTER TABLE public.customers ADD PRIMARY KEY (id);

-- 2. Add customer_id to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- 3. Add customer_id and lead_id to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;
