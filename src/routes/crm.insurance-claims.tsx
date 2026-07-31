import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { FileText, Plus, Search } from "lucide-react";
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Local state to store claims temporarily for UI demonstration
  const [claims, setClaims] = useState<any[]>([]);
  const [newClaim, setNewClaim] = useState({
    policyNumber: "",
    claimAmount: "",
    status: "Pending",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const handleAddClaim = () => {
    if (!newClaim.policyNumber) return;
    
    setClaims([...claims, { id: crypto.randomUUID(), ...newClaim }]);
    setIsAddOpen(false);
    setNewClaim({
      policyNumber: "",
      claimAmount: "",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  const filteredClaims = claims.filter(c => 
    c.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    <Label htmlFor="policyNumber" className="text-right text-xs font-semibold">
                      Policy Number
                    </Label>
                    <Input
                      id="policyNumber"
                      value={newClaim.policyNumber}
                      onChange={(e) => setNewClaim({ ...newClaim, policyNumber: e.target.value })}
                      className="col-span-3 h-9"
                      placeholder="e.g. POL-12345"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claimAmount" className="text-right text-xs font-semibold">
                      Claim Amount
                    </Label>
                    <Input
                      id="claimAmount"
                      type="number"
                      value={newClaim.claimAmount}
                      onChange={(e) => setNewClaim({ ...newClaim, claimAmount: e.target.value })}
                      className="col-span-3 h-9"
                      placeholder="e.g. 50000"
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
                      className="col-span-3 h-9"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right text-xs font-semibold">
                      Status
                    </Label>
                    <div className="col-span-3">
                      <Select value={newClaim.status} onValueChange={(val) => setNewClaim({ ...newClaim, status: val })}>
                        <SelectTrigger className="h-9">
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
                      className="col-span-3"
                      placeholder="Details of the claim..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddClaim}>Save Claim</Button>
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
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Policy Number</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{claim.policyNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{claim.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-600">₹{claim.claimAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                          claim.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                          claim.status === "Rejected" ? "bg-red-100 text-red-700" :
                          claim.status === "Settled" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-md truncate">{claim.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
