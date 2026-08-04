import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Mail, MessageCircle, BarChart3, Users, LayoutTemplate, Send, Clock, ArrowUpRight, Search, Filter, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { CreateCampaignModal } from "@/components/marketing/CreateCampaignModal";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export const Route = createFileRoute("/crm/marketing")({
  component: MarketingPage,
});

function MarketingPage() {
  const [campaigns, setCampaigns] = useSupabaseTable<any[]>("marketing_campaigns", []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setCampaignToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      const { error } = await supabase.from("marketing_campaigns").delete().eq("id", campaignToDelete);
      if (error) throw error;
      setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete));
      toast.success("Campaign deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete campaign");
    } finally {
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  return (
    <div className="space-y-8 print:p-0 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" /> Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your marketing campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.info("Reports coming soon!")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-xl"
          >
            View Reports
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-xl shadow-lg"
          >
            <Plus className="h-4 w-4" /> Create Campaign
          </button>
        </div>
      </div>

      <CreateCampaignModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onSave={(campaign) => {
          // add an ID so useSupabaseTable inserts it properly
          campaign.id = crypto.randomUUID(); 
          setCampaigns((prev) => [campaign, ...prev]);
        }} 
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCampaignToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
      />

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Sent</h3>
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {campaigns.filter((c) => c.status === "Sent").length}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-500" /> 
            Total campaigns: {campaigns.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Avg. Open Rate</h3>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {(() => {
              const rates = campaigns
                .map((c) => parseFloat(c.openRate))
                .filter((n) => !isNaN(n));
              return rates.length
                ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) + "%"
                : "0%";
            })()}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
            Based on tracked campaigns
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Click Rate</h3>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {(() => {
              const rates = campaigns
                .map((c) => parseFloat(c.clickRate))
                .filter((n) => !isNaN(n));
              return rates.length
                ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) + "%"
                : "0%";
            })()}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
            Based on tracked campaigns
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Conversions</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {campaigns.length * 12}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600 dark:text-emerald-500 font-medium">
            <ArrowUpRight className="h-3 w-3" /> Estimated conversions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search campaigns..."
              className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Campaign Name</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Audience</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Sent Date</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Performance</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{campaign.name}</div>
                      <div className="text-xs text-muted-foreground">{campaign.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.type === "Email" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <Mail className="h-3 w-3" /> Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === "Sent" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          Sent
                        </span>
                      )}
                      {campaign.status === "Scheduled" && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300 gap-1.5">
                          <Clock className="h-3 w-3" /> Scheduled
                        </span>
                      )}
                      {campaign.status === "Draft" && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{campaign.audience}</td>
                    <td className="px-6 py-4 text-muted-foreground">{campaign.sentDate}</td>
                    <td className="px-6 py-4 text-right">
                      {campaign.openRate === "Pending" || campaign.openRate === "-" ? (
                        <div className="text-xs text-muted-foreground">{campaign.openRate}</div>
                      ) : (
                        <>
                          <div className="font-medium text-foreground">{campaign.openRate}</div>
                          <div className="text-xs text-muted-foreground">{campaign.clickRate}</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => toast.info("View details coming soon!")}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => confirmDelete(campaign.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
