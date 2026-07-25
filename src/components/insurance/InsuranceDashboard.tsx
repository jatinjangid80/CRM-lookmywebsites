import React from "react";
import { Shield, ShieldAlert, ShieldCheck, Banknote, Landmark, IndianRupee, PieChart, Users } from "lucide-react";

interface InsuranceDashboardProps {
  stats: {
    totalPolicies: number;
    activePolicies: number;
    expiredPolicies: number;
    todaysRenewals: number;
    pendingPayments: number;
    fullPaid: number;
    totalPremium: number;
    totalProfit: number;
    totalPendingAmount: number;
    companiesCount: number;
    vendorsCount: number;
  };
}

export function InsuranceDashboard({ stats }: InsuranceDashboardProps) {
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Policies
        </p>
        <p className="text-2xl font-display font-bold text-foreground">
          {stats.totalPolicies}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <ShieldCheck className="h-12 w-12 text-emerald-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Active Policies
        </p>
        <p className="text-2xl font-display font-bold text-emerald-600">
          {stats.activePolicies}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <ShieldAlert className="h-12 w-12 text-rose-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Expired Policies
        </p>
        <p className="text-2xl font-display font-bold text-rose-600">
          {stats.expiredPolicies}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <ShieldAlert className="h-12 w-12 text-amber-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Today's Renewals
        </p>
        <p className="text-2xl font-display font-bold text-amber-600">
          {stats.todaysRenewals}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Banknote className="h-12 w-12 text-blue-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Gen Insurance
        </p>
        <p className="text-2xl font-display font-bold text-blue-600">
          {formatINR(stats.totalPremium)}
        </p>
      </div>



      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Banknote className="h-12 w-12 text-purple-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Profit
        </p>
        <p className="text-2xl font-display font-bold text-purple-600">
          {formatINR(stats.totalProfit)}
        </p>
      </div>
    </div>
  );
}
