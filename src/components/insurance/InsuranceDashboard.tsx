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
          Total Premium
        </p>
        <p className="text-2xl font-display font-bold text-blue-600">
          {formatINR(stats.totalPremium)}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <IndianRupee className="h-12 w-12 text-emerald-600" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Profit
        </p>
        <p className="text-2xl font-display font-bold text-emerald-600">
          {formatINR(stats.totalProfit)}
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <PieChart className="h-12 w-12 text-orange-500" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Pending Payments
        </p>
        <p className="text-2xl font-display font-bold text-orange-500">
          {stats.pendingPayments}
        </p>
      </div>
      
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Landmark className="h-12 w-12 text-indigo-500" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Insurance Companies
        </p>
        <p className="text-2xl font-display font-bold text-indigo-500">
          {stats.companiesCount}
        </p>
      </div>
      
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Users className="h-12 w-12 text-teal-500" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Vendors
        </p>
        <p className="text-2xl font-display font-bold text-teal-500">
          {stats.vendorsCount}
        </p>
      </div>

    </div>
  );
}
