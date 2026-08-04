import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { FileText, Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/crm/insurance-claims")({
  component: InsuranceClaimsPage,
});

function InsuranceClaimsPage() {
  const auth = getAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [insurancePolicies] = useSupabaseTable<any[]>("insurance_policies", []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  
  // Local state to store claims temporarily for UI demonstration
  const [claims, setClaims] = useSupabaseTable<any[]>("insurance_claims", []);
  const [newClaim, setNewClaim] = useState({
    vehicle_no: "",
    customer_name: "",
    customer_phone: "",

    status: "Pending",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const handleEditClaim = () => {
    if (!selectedClaim || !selectedClaim.vehicle_no) return;
    setClaims(claims.map(c => c.id === selectedClaim.id ? selectedClaim : c));
    setIsEditOpen(false);
    toast.success("Claim updated successfully!");
  };

  const handleDeleteClaim = () => {
    if (deleteTarget) {
      setClaims(claims.filter(c => c.id !== deleteTarget));
      toast.success("Claim deleted successfully!");
      setDeleteTarget(null);
    }
  };

  const handleAddClaim = () => {
    if (!newClaim.vehicle_no) return;
    
    setClaims([...claims, { id: crypto.randomUUID(), ...newClaim }]);
    setIsAddOpen(false);
    toast.success("Claim saved successfully!");
    setNewClaim({
      vehicle_no: "",
    customer_name: "",
    customer_phone: "",

      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  
  const handleStatusChange = (id: string, newStatus: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredClaims = claims.filter(c => 
    (c.vehicle_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.customer_phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 lg:p-8 pt-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Insurance Claims</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and track all insurance claims.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="h-4 w-4 mr-2" /> Add Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Claim</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new insurance claim here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicle_no" className="text-right text-xs font-semibold">
                      Vehicle No.
                    </Label>
                    <div className="col-span-3 relative">
                      <Input
                        id="vehicle_no"
                        autoComplete="off"
                        value={newClaim.vehicle_no}
                        onFocus={() => setShowVehicleDropdown(true)}
                        onBlur={() => setTimeout(() => setShowVehicleDropdown(false), 200)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewClaim({ ...newClaim, vehicle_no: val });
                          setShowVehicleDropdown(true);
                        }}
                        className="h-10 rounded-2xl"
                        placeholder="e.g. MH12AB1234"
                      />
                      {showVehicleDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {insurancePolicies
                            .filter(p => p.vehicle_number && p.vehicle_number.toLowerCase().includes(newClaim.vehicle_no.toLowerCase()))
                            .map(p => (
                            <div 
                              key={p.id} 
                              className="px-3 py-2 cursor-pointer hover:bg-secondary/50 border-b border-border/50 last:border-0"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setNewClaim({
                                  ...newClaim,
                                  vehicle_no: p.vehicle_number,
                                  customer_name: p.customer_name || "",
                                  customer_phone: p.mobile_number || p.alternate_mobile || ""
                                });
                                setShowVehicleDropdown(false);
                              }}
                            >
                              <div className="font-bold text-sm">{p.vehicle_number}</div>
                              <div className="text-xs text-muted-foreground">{p.customer_name}</div>
                            </div>
                          ))}
                          {insurancePolicies.filter(p => p.vehicle_number && p.vehicle_number.toLowerCase().includes(newClaim.vehicle_no.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-xs text-muted-foreground text-center">No vehicles found.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer_name" className="text-right text-xs font-semibold">
                      Customer Name
                    </Label>
                    <Input
                      id="customer_name"
                      value={newClaim.customer_name}
                      onChange={(e) => setNewClaim({ ...newClaim, customer_name: e.target.value })}
                      className="col-span-3 h-10 rounded-2xl"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer_phone" className="text-right text-xs font-semibold">
                      Phone No.
                    </Label>
                    <Input
                      id="customer_phone"
                      value={newClaim.customer_phone}
                      onChange={(e) => setNewClaim({ ...newClaim, customer_phone: e.target.value })}
                      className="col-span-3 h-10 rounded-2xl"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right text-xs font-semibold">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newClaim.date}
                      onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                      className="col-span-3 h-10 rounded-2xl"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right text-xs font-semibold">
                      Status
                    </Label>
                    <div className="col-span-3 rounded-2xl resize-none">
                      <Select value={newClaim.status} onValueChange={(val) => setNewClaim({ ...newClaim, status: val })}>
                        <SelectTrigger className="h-10 rounded-2xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Settled">Settled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label htmlFor="description" className="text-right text-xs font-semibold pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newClaim.description}
                      onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                      className="col-span-3 rounded-2xl resize-none"
                      placeholder="Details of the claim..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full px-6">Cancel</Button>
                  <Button onClick={handleAddClaim} className="rounded-full px-6 bg-[#34A853] hover:bg-[#2b8a44] text-white">Save Claim</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>View Claim Details</DialogTitle>
                </DialogHeader>
                {selectedClaim && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Vehicle No.</Label>
                      <div className="col-span-3 font-medium">{selectedClaim.vehicle_no}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Customer Name</Label>
                      <div className="col-span-3 font-medium">{selectedClaim.customer_name || "—"}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Phone No.</Label>
                      <div className="col-span-3 font-medium">{selectedClaim.customer_phone || "—"}</div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Status</Label>
                      <div className="col-span-3 font-medium">{selectedClaim.status}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Description</Label>
                      <div className="col-span-3 text-sm text-muted-foreground">{selectedClaim.description || "—"}</div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewOpen(false)} className="rounded-full px-6">Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Claim</DialogTitle>
                </DialogHeader>
                {selectedClaim && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Vehicle No.</Label>
                      <Input
                        value={selectedClaim.vehicle_no}
                        onChange={(e) => setSelectedClaim({ ...selectedClaim, vehicle_no: e.target.value })}
                        className="col-span-3 h-10 rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Customer Name</Label>
                      <Input
                        value={selectedClaim.customer_name || ""}
                        onChange={(e) => setSelectedClaim({ ...selectedClaim, customer_name: e.target.value })}
                        className="col-span-3 h-10 rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Phone No.</Label>
                      <Input
                        value={selectedClaim.customer_phone || ""}
                        onChange={(e) => setSelectedClaim({ ...selectedClaim, customer_phone: e.target.value })}
                        className="col-span-3 h-10 rounded-2xl"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Status</Label>
                      <div className="col-span-3 rounded-2xl">
                        <Select value={selectedClaim.status} onValueChange={(val) => setSelectedClaim({ ...selectedClaim, status: val })}>
                          <SelectTrigger className="h-10 rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                            <SelectItem value="Settled">Settled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs font-semibold">Description</Label>
                      <Textarea
                        value={selectedClaim.description || ""}
                        onChange={(e) => setSelectedClaim({ ...selectedClaim, description: e.target.value })}
                        className="col-span-3 rounded-2xl resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-full px-6">Cancel</Button>
                  <Button onClick={handleEditClaim} className="rounded-full px-6 bg-[#34A853] hover:bg-[#2b8a44] text-white">Update Claim</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-transparent focus:bg-background rounded-xl transition-colors"
            />
          </div>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 bg-card border border-border rounded-2xl shadow-sm">
            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">No claims found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery ? "No claims match your search." : "There are no claims available at the moment. Click \"Add Claim\" to get started."}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Vehicle No.</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Description</th>
                    <th className="px-6 py-4 text-right font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{claim.vehicle_no}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{claim.customer_name || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{claim.customer_phone || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{claim.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={claim.status}
                          onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                          className={`appearance-none outline-none cursor-pointer px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border-0 ${
                            claim.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                            claim.status === "Rejected" ? "bg-red-100 text-red-700" :
                            claim.status === "Settled" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Settled">Settled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-md truncate">{claim.description || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => { setSelectedClaim(claim); setIsViewOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            {auth.role === "admin" && (
                              <>
                                <DropdownMenuItem onSelect={() => { setSelectedClaim(claim); setIsEditOpen(true); }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={(e) => {
                                  e.preventDefault();
                                  setDeleteTarget(claim.id);
                                }}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
            <div className="bg-primary p-6 flex flex-col items-center justify-center text-primary-foreground">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="font-display text-lg font-bold text-center text-white">Delete Claim</DialogTitle>
            </div>
            <div className="p-6 text-center space-y-6">
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete this claim? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" className="rounded-xl w-24" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </Button>
                <Button variant="default" className="rounded-xl w-24 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleDeleteClaim}>
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
