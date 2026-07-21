import { useState } from "react";
import { Plus, Edit2, Trash2, Building2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function InsuranceVendorsView() {
  const [vendors, setVendors, loading] = useSupabaseTable<any[]>("insurance_vendors", []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact_person: "", mobile: "", email: "", office_city: "", website: "" });

  const handleSave = () => {
    if (!form.name.trim()) return;
    
    if (editingId) {
      setVendors(vendors.map((v: any) => v.id === editingId ? { ...v, ...form } : v));
    } else {
      setVendors([{ id: crypto.randomUUID(), ...form, created_at: new Date().toISOString() }, ...vendors]);
    }
    setEditingId(null);
    setForm({ name: "", contact_person: "", mobile: "", email: "", office_city: "", website: "" });
  };

  const handleEdit = (v: any) => {
    setEditingId(v.id);
    setForm({
      name: v.name || "",
      contact_person: v.contact_person || "",
      mobile: v.mobile || "",
      email: v.email || "",
      office_city: v.office_city || "",
      website: v.website || ""
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v: any) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Vendor" : "Add New Vendor"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Vendor Name *</label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. PolicyBazaar" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Contact Person</label>
            <Input value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mobile</label>
            <Input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="e.g. +91 9876543210" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. contact@vendor.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Office City</label>
            <Input value={form.office_city} onChange={e => setForm({...form, office_city: e.target.value})} placeholder="e.g. Mumbai" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Website</label>
            <Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="e.g. www.vendor.com" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {editingId ? "Update Vendor" : "Add Vendor"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm({ name: "", contact_person: "", mobile: "", email: "", office_city: "", website: "" }); }}>
              Cancel
            </Button>
          )}
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
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No vendors found. Add one above.
                </td>
              </tr>
            ) : (
              vendors.map((v: any) => (
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
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {v.office_city || "-"}
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
    </div>
  );
}
