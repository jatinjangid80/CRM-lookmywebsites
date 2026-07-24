import re

with open(".temp-leads.tsx", "r") as f:
    content = f.read()

# 1. Update Route
content = content.replace('createFileRoute("/crm/leads")', 'createFileRoute("/crm/insurance-leads")')

# 2. Update interface
content = re.sub(
    r"export interface Lead {.*?}",
    """export interface Lead {
  id: string;
  created_at: string;
  customer_name: string;
  mobile: string;
  email: string;
  city: string;
  status: string;
  insurance_type: string;
  insurance_company: string;
  prev_policy_number: string;
  expiry_date: string;
  sum_insured: string;
  premium: number;
  idv: number;
  ncb: string;
  executive: string;
  notes: string;
}""",
    content,
    flags=re.DOTALL
)

# 3. Update Statuses and Colors
# We need to replace LEAD_STATUSES and LEAD_STATUS_COLORS completely.
content = re.sub(
    r"export const LEAD_STATUSES = \[.*?\];",
    """export const LEAD_STATUSES = [
  "New Lead",
  "Contacted",
  "Quote Shared",
  "Documents Pending",
  "Payment Pending",
  "Policy Issued",
  "Renewal Due",
  "Lost"
];""",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"export const LEAD_STATUS_COLORS: Record<string, string> = {.*?};",
    """export const LEAD_STATUS_COLORS: Record<string, string> = {
  "New Lead": "bg-red-500/10 text-red-500 border-red-500/20",
  "Contacted": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Quote Shared": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Documents Pending": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Payment Pending": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Policy Issued": "bg-green-500/10 text-green-500 border-green-500/20",
  "Renewal Due": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "Lost": "bg-gray-500/10 text-gray-500 border-gray-500/20"
};""",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"export const LEAD_STATUS_COLORS_SOLID: Record<string, string> = {.*?};",
    """export const LEAD_STATUS_COLORS_SOLID: Record<string, string> = {
  "New Lead": "bg-red-500",
  "Contacted": "bg-orange-500",
  "Quote Shared": "bg-blue-500",
  "Documents Pending": "bg-purple-500",
  "Payment Pending": "bg-yellow-500",
  "Policy Issued": "bg-green-500",
  "Renewal Due": "bg-cyan-500",
  "Lost": "bg-gray-500"
};""",
    content,
    flags=re.DOTALL
)

# Replace table names
content = content.replace('useSupabaseTable<Lead[]>("leads", [])', 'useSupabaseTable<Lead[]>("insurance_leads", [])')

# Page headers
content = content.replace("CRM Leads", "General Insurance Leads")
content = content.replace("Track and manage all your travel leads from first contact to successful booking.", "Track every insurance enquiry from first contact to policy issuance.")
content = content.replace("+ Add Lead", "+ Add Insurance Lead")

# Dashboard cards
content = content.replace("Bookings Won", "Policies Issued")
content = content.replace("Expected Revenue", "Premium Collected")

with open("src/routes/crm.insurance-leads.tsx", "w") as f:
    f.write(content)
