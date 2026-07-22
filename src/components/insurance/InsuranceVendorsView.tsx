import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Building2, MoreVertical, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const VENDOR_CATEGORIES = [
  "Insurance", "Hotel", "Transport", "Visa", "Flights", 
  "Travel Insurance", "Forex", "Activities", "Other"
];

export function InsuranceVendorsView() {
  const [vendors, setVendors, loading] = useSupabaseTable<any[]>("insurance_vendors", []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [form, setForm] = useState({ 
    name: "", contact_person: "", mobile: "", alternate_mobile: "", 
    email: "", office_city: "", website: "", address: "", 
    gst_number: "", pan_number: "", category: "" 
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.mobile.trim()) return;
    
    if (editingId) {
      setVendors(vendors.map((v: any) => v.id === editingId ? { ...v, ...form } : v));
    } else {
      setVendors([{ id: crypto.randomUUID(), ...form, created_at: new Date().toISOString() }, ...vendors]);
    }
    closeModal();
  };

  const closeModal = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setForm({ 
      name: "", contact_person: "", mobile: "", alternate_mobile: "", 
      email: "", office_city: "", website: "", address: "", 
      gst_number: "", pan_number: "", category: "" 
    });
  };

  const handleEdit = (v: any) => {
    setEditingId(v.id);
    setForm({
      name: v.name || "",
      contact_person: v.contact_person || "",
      mobile: v.mobile || "",
      alternate_mobile: v.alternate_mobile || "",
      email: v.email || "",
      office_city: v.office_city || "",
      website: v.website || "",
      address: v.address || "",
      gst_number: v.gst_number || "",
      pan_number: v.pan_number || "",
      category: v.category || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v: any) => v.id !== id));
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((v: any) => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (v.contact_person && v.contact_person.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "All" || v.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, categoryFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendors</h2>
          <p className="text-muted-foreground">{vendors.length} Total Vendors</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm rounded-full px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {VENDOR_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Vendor Name</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Contact Details</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Location</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="w-8 h-8 text-muted-foreground/50" />
                    <p>No vendors found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredVendors.map((v: any) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      {v.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{v.contact_person || "-"}</div>
                    <div className="text-xs text-muted-foreground">{v.mobile || "-"} {v.email ? `• ${v.email}` : ""}</div>
                    {v.category && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{v.category}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="text-sm">{v.office_city || "-"}</div>
                    <div className="text-xs">{v.gst_number ? `GST: ${v.gst_number}` : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem onClick={() => handleEdit(v)} className="cursor-pointer gap-2 py-2 text-blue-600 focus:text-blue-700">
                          <Edit2 className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(v.id)} className="cursor-pointer gap-2 py-2 text-rose-600 focus:text-rose-700">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Basic Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Vendor Name *</label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. PolicyBazaar" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Contact Person</label>
                  <Input value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Mobile *</label>
                  <Input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="e.g. +91 9876543210" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Alternate Mobile</label>
                  <Input value={form.alternate_mobile} onChange={e => setForm({...form, alternate_mobile: e.target.value})} placeholder="e.g. +91 9876543211" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. contact@vendor.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Website</label>
                  <Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="e.g. www.vendor.com" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Office City</label>
                  <Input value={form.office_city} onChange={e => setForm({...form, office_city: e.target.value})} placeholder="e.g. Mumbai" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={form.category} onValueChange={(val) => setForm({...form, category: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDOR_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">GST Number</label>
                  <Input value={form.gst_number} onChange={e => setForm({...form, gst_number: e.target.value})} placeholder="e.g. 22AAAAA0000A1Z5" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PAN Number</label>
                  <Input value={form.pan_number} onChange={e => setForm({...form, pan_number: e.target.value})} placeholder="e.g. ABCDE1234F" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Full Address</label>
                  <Textarea 
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})} 
                    placeholder="Enter complete office address"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              disabled={!form.name.trim() || !form.mobile.trim()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? "Update Vendor" : "Save Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
