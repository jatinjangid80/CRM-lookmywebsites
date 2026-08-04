import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { FileEdit, Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/crm/insurance-endorsement")({
  component: InsuranceEndorsementPage,
});

function InsuranceEndorsementPage() {
  const auth = getAuth();
  const isAdmin = (auth?.role === "admin" || auth?.role === "manager");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [insurancePolicies] = useSupabaseTable<any[]>("insurance_policies", []);
  const [endorsements, setEndorsements] = useSupabaseTable<any[]>("insurance_endorsements", []);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEndorsement, setSelectedEndorsement] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const [showPolicyDropdown, setShowPolicyDropdown] = useState(false);
  
  const [newEndorsement, setNewEndorsement] = useState({
    policy_id: "",
    vehicle_no: "",
    customer_name: "",
    customer_phone: "",
    type: "Financial",
    status: "Pending",
    date: new Date().toISOString().split('T')[0],
    premium_impact: "",
    description: ""
  });

  const handleEditEndorsement = () => {
    if (!selectedEndorsement || !selectedEndorsement.policy_id) return;
    const payload = { ...selectedEndorsement };
    if (!payload.premium_impact) payload.premium_impact = null;
    
    setEndorsements(endorsements.map(e => e.id === payload.id ? payload : e));
    setIsEditOpen(false);
    toast.success("Endorsement updated successfully!");
  };

  const handleAddEndorsement = () => {
    if (!newEndorsement.policy_id) return;
    const payload = { ...newEndorsement };
    if (!payload.premium_impact) (payload as any).premium_impact = null;

    setEndorsements([...endorsements, { id: crypto.randomUUID(), ...payload }]);
    setIsAddOpen(false);
    toast.success("Endorsement saved successfully!");
    setNewEndorsement({
      policy_id: "",
      vehicle_no: "",
      customer_name: "",
      customer_phone: "",
      type: "Financial",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      premium_impact: "",
      description: ""
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEndorsements(endorsements.filter(e => e.id !== deleteTarget));
      toast.success("Endorsement deleted.");
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setEndorsements(endorsements.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const filteredEndorsements = endorsements.filter(e => 
    (e.vehicle_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 lg:p-8 pt-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <FileEdit className="w-8 h-8 text-primary" />
              Endorsements
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and track all insurance policy endorsements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="h-4 w-4 mr-2" /> Add Endorsement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Endorsement</DialogTitle>
                  <DialogDescription>
                    Record a new endorsement against an existing policy.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Policy/Vehicle</Label>
                    <div className="col-span-3 relative">
                      <Input 
                        placeholder="Search Vehicle No or Customer..." 
                        value={newEndorsement.vehicle_no || newEndorsement.customer_name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEndorsement({ ...newEndorsement, vehicle_no: val, customer_name: val, policy_id: "" });
                          setShowPolicyDropdown(val.length > 0);
                        }}
                        onFocus={() => {
                          if (newEndorsement.vehicle_no || newEndorsement.customer_name) setShowPolicyDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowPolicyDropdown(false), 200)}
                      />
                      {showPolicyDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[200px] overflow-y-auto">
                          {insurancePolicies.filter(p => 
                            (p.vehicle_number || "").toLowerCase().includes((newEndorsement.vehicle_no || "").toLowerCase()) ||
                            (p.customer_name || "").toLowerCase().includes((newEndorsement.customer_name || "").toLowerCase())
                          ).map((p, idx) => (
                            <div 
                              key={idx} 
                              className="p-2 text-sm hover:bg-secondary cursor-pointer border-b border-border/50 last:border-0"
                              onMouseDown={() => {
                                setNewEndorsement({
                                  ...newEndorsement,
                                  policy_id: p.id,
                                  vehicle_no: p.vehicle_number || p.policy_number,
                                  customer_name: p.customer_name || "",
                                  customer_phone: p.mobile_number || p.alternate_mobile || ""
                                });
                                setShowPolicyDropdown(false);
                              }}
                            >
                              <div className="font-semibold">{p.vehicle_number || p.policy_number || "No Details"}</div>
                              <div className="text-xs text-muted-foreground">{p.customer_name} • {p.policy_type}</div>
                            </div>
                          ))}
                          {insurancePolicies.filter(p => 
                            (p.vehicle_number || "").toLowerCase().includes((newEndorsement.vehicle_no || "").toLowerCase()) ||
                            (p.customer_name || "").toLowerCase().includes((newEndorsement.customer_name || "").toLowerCase())
                          ).length === 0 && (
                            <div className="p-3 text-sm text-muted-foreground text-center">No matching policies found.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Customer Name</Label>
                    <Input 
                      className="col-span-3"
                      value={newEndorsement.customer_name}
                      onChange={e => setNewEndorsement({...newEndorsement, customer_name: e.target.value})}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Phone No.</Label>
                    <Input 
                      className="col-span-3"
                      value={newEndorsement.customer_phone}
                      onChange={e => setNewEndorsement({...newEndorsement, customer_phone: e.target.value})}
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <Select value={newEndorsement.type} onValueChange={v => setNewEndorsement({...newEndorsement, type: v})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Non-Financial">Non-Financial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <Select value={newEndorsement.status} onValueChange={v => setNewEndorsement({...newEndorsement, status: v})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Date</Label>
                    <Input 
                      type="date"
                      className="col-span-3"
                      value={newEndorsement.date}
                      onChange={e => setNewEndorsement({...newEndorsement, date: e.target.value})}
                    />
                  </div>
                  
                  {newEndorsement.type === "Financial" && (
                    <div className="grid grid-cols-4 items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                      <Label className="text-right">Premium Impact (₹)</Label>
                      <Input 
                        placeholder="e.g. 1500 or -500 for refund"
                        type="number"
                        className="col-span-3"
                        value={newEndorsement.premium_impact}
                        onChange={e => setNewEndorsement({...newEndorsement, premium_impact: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Description</Label>
                    <Textarea 
                      placeholder="Reason for endorsement..."
                      className="col-span-3 resize-none h-24"
                      value={newEndorsement.description}
                      onChange={e => setNewEndorsement({...newEndorsement, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEndorsement} disabled={!newEndorsement.policy_id}>Save Endorsement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by vehicle, customer or description..." 
              className="pl-9 bg-transparent border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4">Policy / Vehicle</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Premium Impact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredEndorsements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileEdit className="h-8 w-8 opacity-20" />
                        <p>No endorsements found.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEndorsements.map((e, idx) => (
                  <tr key={e.id || idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{e.vehicle_no || "N/A"}</td>
                    <td className="px-6 py-4">{e.customer_name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        e.type === 'Financial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{e.date}</td>
                    <td className="px-6 py-4">
                      {e.type === 'Financial' ? (
                        <span className={`font-medium ${Number(e.premium_impact) > 0 ? 'text-rose-600 dark:text-rose-400' : Number(e.premium_impact) < 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                          {Number(e.premium_impact) > 0 ? '+' : ''}{Number(e.premium_impact) ? `₹${Math.abs(Number(e.premium_impact)).toLocaleString()}` : "Nil"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        e.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                        e.status === 'Cancelled' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => { setSelectedEndorsement(e); setIsViewOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedEndorsement(e); setIsEditOpen(true); }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              {e.status === 'Pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(e.id, 'Approved')} className="text-emerald-600">
                                    <FileEdit className="mr-2 h-4 w-4" /> Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(e.id, 'Rejected')} className="text-rose-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(e.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Endorsement Details</DialogTitle>
            </DialogHeader>
            {selectedEndorsement && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vehicle / Policy</p>
                    <p className="font-medium">{selectedEndorsement.vehicle_no}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer Name</p>
                    <p className="font-medium">{selectedEndorsement.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                    <p className="font-medium">{selectedEndorsement.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedEndorsement.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        selectedEndorsement.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                        selectedEndorsement.status === 'Cancelled' ? 'bg-slate-100 text-slate-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {selectedEndorsement.status}
                      </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                    <p className="font-medium">{selectedEndorsement.type}</p>
                  </div>
                  {selectedEndorsement.type === 'Financial' && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Premium Impact</p>
                      <p className="font-medium">₹{selectedEndorsement.premium_impact || 0}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <div className="bg-secondary/30 p-3 rounded-lg text-sm whitespace-pre-wrap border border-border/50">
                    {selectedEndorsement.description || "No description provided."}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Endorsement</DialogTitle>
              <DialogDescription>
                Update the details of this endorsement.
              </DialogDescription>
            </DialogHeader>
            {selectedEndorsement && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Policy/Vehicle</Label>
                  <Input 
                    className="col-span-3 bg-secondary/50" 
                    value={selectedEndorsement.vehicle_no} 
                    disabled 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <Select value={selectedEndorsement.type} onValueChange={v => setSelectedEndorsement({...selectedEndorsement, type: v})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Non-Financial">Non-Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <Select value={selectedEndorsement.status} onValueChange={v => setSelectedEndorsement({...selectedEndorsement, status: v})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Date</Label>
                  <Input 
                    type="date"
                    className="col-span-3"
                    value={selectedEndorsement.date}
                    onChange={e => setSelectedEndorsement({...selectedEndorsement, date: e.target.value})}
                  />
                </div>
                
                {selectedEndorsement.type === "Financial" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Premium Impact (₹)</Label>
                    <Input 
                      type="number"
                      className="col-span-3"
                      value={selectedEndorsement.premium_impact}
                      onChange={e => setSelectedEndorsement({...selectedEndorsement, premium_impact: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Description</Label>
                  <Textarea 
                    className="col-span-3 resize-none h-24"
                    value={selectedEndorsement.description}
                    onChange={e => setSelectedEndorsement({...selectedEndorsement, description: e.target.value})}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEditEndorsement}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
            <div className="bg-primary p-6 flex flex-col items-center justify-center text-primary-foreground">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="font-display text-lg font-bold text-center text-white">Delete Endorsement</DialogTitle>
            </div>
            <div className="p-6 text-center space-y-6">
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete this endorsement? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" className="rounded-xl w-24" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </Button>
                <Button variant="default" className="rounded-xl w-24 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
