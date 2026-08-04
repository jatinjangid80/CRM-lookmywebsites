import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, MessageCircle, Send, Search, Filter, Copy, Edit2, LayoutTemplate, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/crm/marketing")({
  component: MarketingPage,
});

type Channel = "WhatsApp" | "Email" | "SMS";
type Category = "Featured" | "Domestic Tours" | "International Tours" | "Honeymoon" | "Family Packages" | "Travel Insurance" | "Visa Services" | "Hotel Booking" | "Festival Offers" | "Promotional Messages";

interface Template {
  id: string;
  name: string;
  category: Category;
  channel: Channel;
  lastUpdated: string;
  status: "Active" | "Draft";
  content: string;
}

import { useSupabaseTable } from "@/hooks/useSupabaseTable";

const CATEGORIES: Category[] = [
  "Featured", "Domestic Tours", "International Tours", "Honeymoon", 
  "Family Packages", "Travel Insurance", "Visa Services", "Hotel Booking", 
  "Festival Offers", "Promotional Messages"
];

function MarketingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedChannel, setSelectedChannel] = useState<Channel | "All">("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<{name: string, category: string, channel: string, customCategory: string, customChannel: string, content: string}>({
    name: "",
    category: "Featured",
    channel: "WhatsApp",
    customCategory: "",
    customChannel: "",
    content: ""
  });
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

  const [dbTemplates, setDbTemplates] = useSupabaseTable<any[]>("marketing_campaigns", []);

  const templates: Template[] = dbTemplates.map(c => ({
    id: c.id,
    name: c.name || "Unnamed Template",
    category: (c.audience as Category) || "Featured",
    channel: (c.type as Channel) || "WhatsApp",
    lastUpdated: c.sentDate || "Just now",
    status: (c.status as "Active" | "Draft") || "Active",
    content: c.description || "No content provided."
  }));

  const filteredTemplates = templates.filter(t => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (selectedChannel !== "All" && t.channel !== selectedChannel) return false;
    return true;
  });

  return (
    <div className="space-y-8 print:p-0 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <LayoutTemplate className="h-8 w-8 text-primary" /> Template Store
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and use marketing templates for your campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl shadow-lg h-10 px-4"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Template
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 gap-4 items-center flex-wrap w-full">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-10 bg-white">
                <Filter className="h-4 w-4 mr-2" />
                Category: {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto rounded-xl">
              <DropdownMenuItem onClick={() => setSelectedCategory("All")} className="rounded-lg">
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {CATEGORIES.map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)} className="rounded-lg">
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-10 bg-white">
                <Filter className="h-4 w-4 mr-2" />
                Channel: {selectedChannel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setSelectedChannel("All")} className="rounded-lg">All Channels</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChannel("WhatsApp")} className="rounded-lg">WhatsApp</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChannel("Email")} className="rounded-lg">Email</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChannel("SMS")} className="rounded-lg">SMS</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid Layout Categories */}
      {(selectedCategory === "All" && selectedChannel === "All" && !searchQuery) && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-lg">WhatsApp Templates</h2>
            </div>
            <div className="space-y-3 flex-1">
              {templates.filter(t => t.channel === "WhatsApp").slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => setPreviewTemplate(t)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  {t.name}
                </div>
              ))}
              {templates.filter(t => t.channel === "WhatsApp").length === 0 && (
                <div className="text-sm text-muted-foreground italic">No templates found.</div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-emerald-50/30" onClick={() => setSelectedChannel("WhatsApp")}>
              Browse WhatsApp
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-lg">Email Templates</h2>
            </div>
            <div className="space-y-3 flex-1">
              {templates.filter(t => t.channel === "Email").slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-600 cursor-pointer transition-colors" onClick={() => setPreviewTemplate(t)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  {t.name}
                </div>
              ))}
              {templates.filter(t => t.channel === "Email").length === 0 && (
                <div className="text-sm text-muted-foreground italic">No templates found.</div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 bg-blue-50/30" onClick={() => setSelectedChannel("Email")}>
              Browse Emails
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-lg">SMS Templates</h2>
            </div>
            <div className="space-y-3 flex-1">
              {templates.filter(t => t.channel === "SMS").slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-violet-600 cursor-pointer transition-colors" onClick={() => setPreviewTemplate(t)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
                  {t.name}
                </div>
              ))}
              {templates.filter(t => t.channel === "SMS").length === 0 && (
                <div className="text-sm text-muted-foreground italic">No templates found.</div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 bg-violet-50/30" onClick={() => setSelectedChannel("SMS")}>
              Browse SMS
            </Button>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card mt-8">
        <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-lg font-display">All Templates</h2>
          <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-md font-medium">{filteredTemplates.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Template Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Channel</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Last Updated</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{template.name}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{template.category}</td>
                  <td className="px-6 py-4">
                    {template.channel === "WhatsApp" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </span>
                    )}
                    {template.channel === "Email" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        <Mail className="h-3 w-3" /> Email
                      </span>
                    )}
                    {template.channel === "SMS" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                        <Send className="h-3 w-3" /> SMS
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{template.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => setPreviewTemplate(template)} className="rounded-lg cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /> Use Template
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setTemplateToDelete(template)} 
                            className="rounded-lg cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No templates found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          {previewTemplate && (
            <>
              <div className="bg-muted/50 p-6 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <DialogTitle className="text-xl font-display">{previewTemplate.name}</DialogTitle>
                  {previewTemplate.channel === "WhatsApp" && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"><MessageCircle className="h-3.5 w-3.5"/> WhatsApp</span>}
                  {previewTemplate.channel === "Email" && <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"><Mail className="h-3.5 w-3.5"/> Email</span>}
                  {previewTemplate.channel === "SMS" && <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700"><Send className="h-3.5 w-3.5"/> SMS</span>}
                </div>
                <DialogDescription>
                  Preview of the template content.
                </DialogDescription>
              </div>

              <div className="p-6">
                <div className="bg-secondary/40 border border-border rounded-xl p-5 mb-6 relative group">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                    {previewTemplate.content}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-xl flex-1 h-11 bg-white hover:bg-muted" onClick={() => toast.success("Template duplicated successfully!")}>
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </Button>
                  <Button variant="outline" className="rounded-xl flex-1 h-11 bg-white hover:bg-muted" onClick={() => toast.info("Opening editor...")}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </div>
                
                <Button className="rounded-xl w-full h-12 mt-3 text-base shadow-lg" onClick={() => {
                  toast.success(`Started new campaign with ${previewTemplate.name}`);
                  setPreviewTemplate(null);
                }}>
                  Use Template
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Create New Template</DialogTitle>
            <DialogDescription>Add a new marketing template to your store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <input 
                type="text" 
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="e.g. Summer Sale"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <select 
                value={newTemplate.channel}
                onChange={(e) => setNewTemplate({...newTemplate, channel: e.target.value})}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Other">Other</option>
              </select>
              {newTemplate.channel === "Other" && (
                <input 
                  type="text" 
                  value={newTemplate.customChannel}
                  onChange={(e) => setNewTemplate({...newTemplate, customChannel: e.target.value})}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-2"
                  placeholder="Enter custom channel..."
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
              </select>
              {newTemplate.category === "Other" && (
                <input 
                  type="text" 
                  value={newTemplate.customCategory}
                  onChange={(e) => setNewTemplate({...newTemplate, customCategory: e.target.value})}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-2"
                  placeholder="Enter custom category..."
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea 
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Type your template message here..."
              />
            </div>
            <Button 
              className="w-full h-11 rounded-xl mt-2" 
              onClick={() => {
                const finalChannel = newTemplate.channel === "Other" ? newTemplate.customChannel.trim() : newTemplate.channel;
                const finalCategory = newTemplate.category === "Other" ? newTemplate.customCategory.trim() : newTemplate.category;

                if (!newTemplate.name || !newTemplate.content || !finalChannel || !finalCategory) {
                  toast.error("Please fill in all required fields.");
                  return;
                }
                const record = {
                  id: crypto.randomUUID(),
                  name: newTemplate.name,
                  audience: finalCategory,
                  type: finalChannel,
                  description: newTemplate.content,
                  status: "Active",
                  sentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                };
                setDbTemplates((prev: any) => [...prev, record]);
                toast.success("Template created successfully!");
                setIsCreateModalOpen(false);
                setNewTemplate({ name: "", category: "Featured", channel: "WhatsApp", content: "" });
              }}
            >
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Template
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Are you sure you want to delete the <span className="font-semibold text-foreground">{templateToDelete?.name}</span> template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="rounded-xl h-11 px-6" onClick={() => setTemplateToDelete(null)}>
              Cancel
            </Button>
            <Button 
              className="rounded-xl h-11 px-6"
              onClick={() => {
                if (templateToDelete) {
                  setDbTemplates((prev: any) => prev.filter((t: any) => t.id !== templateToDelete.id));
                  toast.success("Template deleted successfully");
                  setTemplateToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
