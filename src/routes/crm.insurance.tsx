import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Shield } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { InsuranceDashboard } from "@/components/insurance/InsuranceDashboard";
import { InsuranceTable } from "@/components/insurance/InsuranceTable";
import { InsuranceForm } from "@/components/insurance/InsuranceForm";
import { RenewalsView } from "@/components/insurance/RenewalsView";
import { InsuranceVendorsView } from "@/components/insurance/InsuranceVendorsView";
import { InsuranceCompaniesView } from "@/components/insurance/InsuranceCompaniesView";
import { InsuranceTransactionsView } from "@/components/insurance/InsuranceTransactionsView";
import { InsuranceCustomerStatusView } from "@/components/insurance/InsuranceCustomerStatusView";

export const Route = createFileRoute("/crm/insurance")({
  component: GeneralInsurancePage,
});

export type TabType = "Policies" | "Renewals" | "Vendors" | "Companies" | "CustomerStatus" | "VendorStatus" | "GenTransactions";

function GeneralInsurancePage() {
  const [activeTab, setActiveTab] = useState<TabType>("Policies");
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [policyToDelete, setPolicyToDelete] = useState<any>(null);

  const [policies, setPolicies] = useSupabaseTable<any[]>("insurance_policies", []);
  const [companies] = useSupabaseTable<any[]>("insurance_companies", []);
  const [vendors] = useSupabaseTable<any[]>("insurance_vendors", []);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let active = 0, expired = 0, todaysRenewals = 0;
    let pending = 0, fullPaid = 0;
    let totalPremium = 0, totalProfit = 0;

    policies.forEach(p => {
      const expiry = new Date(p.expiry_date);
      expiry.setHours(0, 0, 0, 0);

      if (p.status === 'Expired' || expiry.getTime() < today.getTime()) expired++;
      else active++;

      if (expiry.getTime() === today.getTime()) todaysRenewals++;

      if (p.payment_status === 'Pending' || p.payment_status === 'Partial') pending++;
      else if (p.payment_status === 'Full Paid') fullPaid++;

      totalPremium += (Number(p.total_premium) || 0);
      totalProfit += (Number(p.profit) || 0);
    });

    return {
      totalPolicies: policies.length,
      activePolicies: active,
      expiredPolicies: expired,
      todaysRenewals,
      pendingPayments: pending,
      fullPaid,
      totalPremium,
      totalProfit,
      companiesCount: companies.length,
      vendorsCount: vendors.length
    };
  }, [policies, companies, vendors]);

  const handleAddNew = () => {
    setEditingPolicy(null);
    setShowForm(true);
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setShowForm(true);
  };

  const handleDuplicate = (policy: any) => {
    // When duplicating or renewing, clear the ID and specific fields like policy number
    const dup = { ...policy };
    delete dup.id;
    delete dup.created_at;
    dup.policy_number = "";
    dup.payment_status = "Pending";
    dup.customer_paid = 0;
    dup.vendor_paid = 0;
    dup.transaction_reference = "";

    // Auto increment dates by 1 year for quick renewals
    if (dup.issue_date) {
      const issue = new Date(dup.issue_date);
      issue.setFullYear(issue.getFullYear() + 1);
      dup.issue_date = issue.toISOString().split('T')[0];
    }
    if (dup.expiry_date) {
      const exp = new Date(dup.expiry_date);
      exp.setFullYear(exp.getFullYear() + 1);
      dup.expiry_date = exp.toISOString().split('T')[0];
    }

    setEditingPolicy(dup);
    setShowForm(true);
  };

  const handleDelete = (policy: any) => {
    setPolicyToDelete(policy);
  };

  const confirmDeletePolicy = () => {
    if (policyToDelete) {
      const filtered = policies.filter(p => p.id !== policyToDelete.id);
      setPolicies(filtered);
      setPolicyToDelete(null);
    }
  };

  const handleSavePolicy = (updatedData: any) => {
    if (updatedData.id) {
      const newPolicies = policies.map(p => p.id === updatedData.id ? updatedData : p);
      setPolicies(newPolicies);
    } else {
      const newPolicy = {
        ...updatedData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      setPolicies([newPolicy, ...policies]);
    }
    setShowForm(false);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto w-full max-w-full m-0 bg-muted/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            General Insurance
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage insurance policies, renewals, companies, and vendors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> New Policy
          </Button>
        </div>
      </div>

      <InsuranceDashboard stats={stats} />

      <div className="flex flex-wrap items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <Button
          variant={activeTab === "Policies" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Policies" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Policies")}
        >
          All Policies
        </Button>
        <Button
          variant={activeTab === "Renewals" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Renewals" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Renewals")}
        >
          Upcoming Renewals
        </Button>
        <Button
          variant={activeTab === "Vendors" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Vendors" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Vendors")}
        >
          Vendors
        </Button>
        <Button
          variant={activeTab === "Companies" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Companies" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Companies")}
        >
          Companies
        </Button>
        <Button
          variant={activeTab === "CustomerStatus" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "CustomerStatus" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("CustomerStatus")}
        >
          Customer Status
        </Button>
        <Button
          variant={activeTab === "VendorStatus" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "VendorStatus" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("VendorStatus")}
        >
          Vendor Status
        </Button>
        <Button
          variant={activeTab === "GenTransactions" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "GenTransactions" ? "bg-card text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("GenTransactions")}
        >
          Gen Transactions
        </Button>
      </div>

      <div className="mt-4">
        {activeTab === "Policies" && (
          <div className="animate-in fade-in duration-300">
            <InsuranceTable
              policies={policies}
              companies={companies}
              vendors={vendors}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        )}

        {activeTab === "Renewals" && (
          <RenewalsView
            policies={policies}
            companies={companies}
            vendors={vendors}
            onRenew={handleDuplicate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "Vendors" && <InsuranceVendorsView />}
        {activeTab === "Companies" && <InsuranceCompaniesView />}
        
        {activeTab === "CustomerStatus" && (
          <InsuranceCustomerStatusView policies={policies} />
        )}
        
        {activeTab === "VendorStatus" && (
          <div className="bg-card rounded-xl border border-border p-12 text-center animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Vendor Payment Status</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Track and manage vendor payments, follow-ups, and statuses here.</p>
          </div>
        )}

        {activeTab === "GenTransactions" && (
          <InsuranceTransactionsView policies={policies} />
        )}
      </div>

      {showForm && (
        <InsuranceForm
          onClose={() => setShowForm(false)}
          initialData={editingPolicy}
          onSave={handleSavePolicy}
          companies={companies}
          vendors={vendors}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!policyToDelete}
        onClose={() => setPolicyToDelete(null)}
        onConfirm={confirmDeletePolicy}
        title="Delete Policy"
        description="Are you sure you want to permanently delete this policy? This action cannot be undone."
      />
    </div>
  );
}
