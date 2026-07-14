-- 1. Create Expenses Table
CREATE TABLE expenses (
  "id" text PRIMARY KEY,
  "date" text,
  "category" text,
  "amount" numeric,
  "paymentMode" text,
  "reference" text,
  "description" text,
  "status" text
);

-- 2. Create Payment Follow-ups Table
CREATE TABLE payment_followups (
  "id" text PRIMARY KEY,
  "invoiceId" text,
  "customerId" text,
  "customerName" text,
  "customerPhone" text,
  "invoiceDate" text,
  "totalAmount" numeric,
  "pendingAmount" numeric,
  "nextFollowUpDate" text,
  "nextFollowUpTime" text,
  "repeat" text,
  "notificationReminder" numeric,
  "notes" text
);

-- 3. Create Transactions Table
CREATE TABLE transactions (
  "id" text PRIMARY KEY,
  "type" text,
  "entityType" text,
  "entityId" text,
  "entityName" text,
  "amount" numeric,
  "date" text,
  "paymentMode" text,
  "notes" text
);

-- Enable RLS (Optional but good practice, assuming public anon access for now)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (assuming a permissive setup)
CREATE POLICY "Allow all operations on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payment_followups" ON payment_followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
