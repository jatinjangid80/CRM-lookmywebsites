create table public.marketing_campaigns (
  id text not null default (gen_random_uuid ())::text,
  name text not null,
  description text null,
  type text null,
  status text null,
  audience text null,
  "sentDate" text null,
  "openRate" text null,
  "clickRate" text null,
  created_at timestamp with time zone null default now(),
  constraint marketing_campaigns_pkey primary key (id)
) TABLESPACE pg_default;

-- Insert initial templates
INSERT INTO public.marketing_campaigns (name, description, type, status, audience, "sentDate")
VALUES 
  ('Goa Package', 'Hello {{CustomerName}},

Explore Goa with our exclusive package.

✔ Hotel
✔ Breakfas
✔ Sightseeing

Starting from ₹14,999

Call: +91 XXXXX XXXXX', 'WhatsApp', 'Active', 'Domestic Tours', 'Today'),
  ('Dubai Offer', 'Hi {{CustomerName}},

Get ready for Dubai! Book now and save 20% on our premium package.

Best Regards,
Look My Holidays', 'Email', 'Active', 'International Tours', 'Yesterday'),
  ('Visa Reminder', 'Dear {{CustomerName}}, your Visa application requires additional documents. Please check your email for details.', 'SMS', 'Active', 'Visa Services', '2 days ago'),
  ('Honeymoon Special', 'Hi {{CustomerName}},

Make your honeymoon unforgettable! Check out our Maldives special offer.

Call: +91 XXXXX XXXXX', 'WhatsApp', 'Active', 'Honeymoon', '1 week ago'),
  ('Welcome Email', 'Welcome to Look My Holidays, {{CustomerName}}!

We are excited to help you plan your next trip.', 'Email', 'Active', 'Featured', '1 month ago');
