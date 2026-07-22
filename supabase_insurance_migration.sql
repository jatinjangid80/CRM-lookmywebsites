-- Insurance Vendors
create table public.insurance_vendors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_person text,
  mobile text,
  email text,
  office_city text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insurance Companies
create table public.insurance_companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert Default Companies
insert into public.insurance_companies (name) values
  ('Tata AIG'),
  ('Go Digit'),
  ('ICICI Lombard'),
  ('United India Insurance'),
  ('Bajaj Allianz'),
  ('Liberty General'),
  ('Future Generali'),
  ('Reliance General'),
  ('Universal Sompo'),
  ('IFFCO Tokio'),
  ('SBI General'),
  ('Care Health'),
  ('LIC'),
  ('New India Assurance'),
  ('Raheja QBE'),
  ('Shriram General');

-- Insurance Policies
create table public.insurance_policies (
  id uuid default gen_random_uuid() primary key,
  
  -- Reference & Customer
  school_name text,
  reference_name text,
  customer_name text not null,
  mobile_number text not null,
  alternate_mobile text,
  email text,
  address text,
  city text,
  state text,
  customer_id uuid,
  
  -- Company & Vendor
  company_id uuid references public.insurance_companies(id),
  vendor_id uuid references public.insurance_vendors(id),
  
  -- Policy Details
  policy_number text,
  issue_date date,
  expiry_date date,
  vehicle_number text,
  vehicle_model text,
  seating_capacity integer,
  chassis_number text,
  engine_number text,
  fuel_type text,
  registration_date date,
  policy_type text,
  idv_value numeric,
  previous_policy_number text,
  previous_insurer text,
  ncb_percentage numeric,
  
  -- Premium Details
  od_premium numeric default 0,
  tp_premium numeric default 0,
  net_premium numeric default 0,
  gst numeric default 0,
  total_premium numeric default 0,
  
  -- Payment Details
  customer_paid numeric default 0,
  vendor_paid numeric default 0,
  profit numeric default 0,
  payment_date date,
  payment_mode text,
  transaction_reference text,
  payment_status text default 'Pending',
  
  -- Metadata
  notes text,
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter publication supabase_realtime add table public.insurance_vendors;
alter publication supabase_realtime add table public.insurance_companies;
alter publication supabase_realtime add table public.insurance_policies;

-- Added for extra payment tracking
alter table public.insurance_policies add column if not exists paid_by text;
alter table public.insurance_policies add column if not exists amount_paid numeric default 0;
