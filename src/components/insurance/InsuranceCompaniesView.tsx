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

export function InsuranceCompaniesView() {
  const [companies, setCompanies, loading] = useSupabaseTable<any[]>("insurance_companies", []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "" });

  const handleSave = () => {
    if (!form.name.trim()) return;
    
    if (editingId) {
      setCompanies(companies.map((c: any) => c.id === editingId ? { ...c, ...form } : c));
    } else {
      setCompanies([{ id: crypto.randomUUID(), ...form, created_at: new Date().toISOString() }, ...companies]);
    }
    setEditingId(null);
    setForm({ name: "" });
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ name: c.name || "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Company" : "Add New Company"}</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-sm">
            <label className="text-sm font-medium mb-1 block">Company Name *</label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. HDFC ERGO" />
          </div>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {editingId ? "Update" : "Add Company"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm({ name: "" }); }}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden max-w-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Company Name</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                  No companies found. Add one above.
                </td>
              </tr>
            ) : (
              companies.map((c: any) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      {c.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem onClick={() => handleEdit(c)} className="cursor-pointer gap-2 py-2 text-blue-600 focus:text-blue-700">
                          <Edit2 className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="cursor-pointer gap-2 py-2 text-rose-600 focus:text-rose-700">
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
