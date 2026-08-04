import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Mail, MessageCircle, BarChart3, Users, LayoutTemplate, Send, Clock, ArrowUpRight, Search, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/crm/marketing")({
  component: MarketingPage,
});

function MarketingPage() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <div className="space-y-8 print:p-0 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" /> Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your marketing campaigns, audiences, and templates.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-xl">
            View Reports
          </button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-xl shadow-lg">
            <Plus className="h-4 w-4" /> Create Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Sent</h3>
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12,450</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" /> +14.5% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Avg. Open Rate</h3>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">42.8%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" /> +2.1% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Click Rate</h3>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12.4%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" /> +4.3% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Conversions</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">186</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" /> +32 new bookings
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="space-y-6">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'campaigns' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'}`}
            >
              <Megaphone className="h-4 w-4" /> Campaigns
            </button>
            <button
              onClick={() => setActiveTab('audiences')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'audiences' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'}`}
            >
              <Users className="h-4 w-4" /> Audiences
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'}`}
            >
              <LayoutTemplate className="h-4 w-4" /> Templates
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'campaigns' && (
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
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                <Filter className="h-4 w-4" /> Filter
              </button>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">Diwali Special Offer</div>
                        <div className="text-xs text-muted-foreground">Promo code for 10% off</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <Mail className="h-3 w-3" /> Email
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          Sent
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">Past Customers (4,200)</td>
                      <td className="px-6 py-4 text-muted-foreground">Oct 24, 2024</td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-foreground">45% Open</div>
                        <div className="text-xs text-muted-foreground">12% Click</div>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">Dubai Shopping Festival</div>
                        <div className="text-xs text-muted-foreground">Exclusive packages update</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300 gap-1.5">
                          <Clock className="h-3 w-3" /> Scheduled
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">Dubai Leads (850)</td>
                      <td className="px-6 py-4 text-muted-foreground">Nov 15, 2024</td>
                      <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                        Pending
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">Maldives Honeymoon Intro</div>
                        <div className="text-xs text-muted-foreground">Resort showcase</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <Mail className="h-3 w-3" /> Email
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Draft
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">Honeymoon Interest (120)</td>
                      <td className="px-6 py-4 text-muted-foreground">-</td>
                      <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audiences' && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">Audience Segments</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Create and manage customer lists based on tags, booking history, and preferences.
            </p>
            <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Create Segment
            </button>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <LayoutTemplate className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">Message Templates</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Build reusable email and WhatsApp templates for quick campaign launches.
            </p>
            <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
