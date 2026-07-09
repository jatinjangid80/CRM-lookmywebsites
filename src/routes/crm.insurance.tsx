import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Shield } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";

import { InsuranceDashboard } from "@/components/insurance/InsuranceDashboard";
import { InsuranceTable } from "@/components/insurance/InsuranceTable";
import { InsuranceForm } from "@/components/insurance/InsuranceForm";
import { RenewalsView } from "@/components/insurance/RenewalsView";

export const Route = createFileRoute("/crm/insurance")({
  component: GeneralInsurancePage,
});

function GeneralInsurancePage() {
  const [activeTab, setActiveTab] = useState<"Policies" | "Renewals">("Policies");
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const [policies, setPolicies] = useSupabaseTable<any[]>("insurance_policies", []);
  const [companies] = useSupabaseTable<any[]>("insurance_companies", []);
  const [vendors] = useSupabaseTable<any[]>("insurance_vendors", []);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let active = 0, expired = 0, todaysRenewals = 0;
    let pending = 0, fullPaid = 0;
    let totalPremium = 0, totalProfit = 0;

    policies.forEach(p => {
      const expiry = new Date(p.expiry_date);
      expiry.setHours(0,0,0,0);
      
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
    if (window.confirm("Are you sure you want to permanently delete this policy?")) {
      const filtered = policies.filter(p => p.id !== policy.id);
      setPolicies(filtered);
    }
  };

  const handleSavePolicy = (updatedData: any) => {
    // In a real app we might do some extra validation
    
    if (updatedData.id) {
      // Update existing
      const newPolicies = policies.map(p => p.id === updatedData.id ? updatedData : p);
      setPolicies(newPolicies);
    } else {
      // Create new (assign a temp UUID if not handled by backend)
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
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto w-full max-w-full m-0 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
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
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Policy
          </Button>
        </div>
      </div>

      <InsuranceDashboard stats={stats} />

      <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl w-fit">
        <Button 
          variant={activeTab === "Policies" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Policies" ? "bg-white text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Policies")}
        >
          All Policies
        </Button>
        <Button 
          variant={activeTab === "Renewals" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "Renewals" ? "bg-white text-foreground shadow-sm rounded-lg" : "text-muted-foreground hover:text-foreground"}
          onClick={() => setActiveTab("Renewals")}
        >
          Upcoming Renewals
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
      </div>

      {showForm && (
        <InsuranceForm 
          onClose={() => setShowForm(false)} 
          initialData={editingPolicy}
          onSave={handleSavePolicy}
        />
      )}
    </div>
  );
}
