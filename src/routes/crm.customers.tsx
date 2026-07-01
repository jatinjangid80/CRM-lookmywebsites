import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Crown, Trash2, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookings, customers as initialCustomers, formatINR, type Customer } from "@/lib/mock-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";

export const Route = createFileRoute("/crm/customers")({
  component: CustomersPage,
});

const tierColor: Record<string, string> = {
  Silver: "bg-slate-100 text-slate-700",
  Gold: "bg-amber-100 text-amber-700",
  Platinum: "bg-violet-100 text-violet-700",
};

function CustomersPage() {
  const [customerList, setCustomerList] = useSupabaseTable<Customer[]>("customers", []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogType, setDialogType] = useState<"profile" | "history" | "delete" | null>(null);

  // Editable records for profile
  const [editPassport, setEditPassport] = useState("");
  const [editExpiry, setEditExpiry] = useState("");
  const [editVisa, setEditVisa] = useState("");

  useEffect(() => {
    if (selectedCustomer) {
      setEditPassport(selectedCustomer.passportNumber || "");
      setEditExpiry(selectedCustomer.passportExpiry || "");
      setEditVisa(selectedCustomer.visaStatus || "Not Applied");
    }
  }, [selectedCustomer]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    const currentMaxId = customerList.reduce((max, c) => {
      const num = parseInt(c.id.replace("CRN", ""));
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `CRN${String(currentMaxId + 1).padStart(3, "0")}`;

    const customer: Customer = {
      id: nextId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      trips: 0,
      totalSpend: 0,
      tier: "Silver",
    };

    setCustomerList([customer, ...customerList]);
    setIsAddOpen(false);
    setNewCustomer({ name: "", phone: "", email: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Repeat travellers, loyalty tiers and lifetime value.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <Plus className="mr-2 h-4 w-4" /> Add customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Customer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customerList.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-card relative group"
          >
            <button
              onClick={() => {
                setSelectedCustomer(c);
                setDialogType("delete");
              }}
              className="absolute right-3 top-3 p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-md"
              title="Delete customer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 pr-6">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.id} · {c.phone}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Trips</p>
                <p className="font-display text-lg font-bold">{c.trips}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total spend</p>
                <p className="font-display text-lg font-bold text-primary">
                  {formatINR(c.totalSpend)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCustomer(c);
                  setDialogType("profile");
                }}
              >
                Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCustomer(c);
                  setDialogType("history");
                }}
              >
                History
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {dialogType === "profile" &&
            selectedCustomer &&
            (() => {
              const customerBookings = bookings.filter((b) => b.customer === selectedCustomer.name);
              const totalBilled = customerBookings.reduce((s, b) => s + b.amount, 0);
              const totalPaid = customerBookings.reduce((s, b) => s + b.paid, 0);
              const ledgerBalance = totalBilled - totalPaid;

              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Customer Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedCustomer.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs bg-secondary/20 p-4 rounded-xl border border-border">
                      <div>
                        <p className="text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium break-all">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                    </div>

                    {/* Financial Ledger */}
                    <div className="space-y-2 border-t border-border pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5 text-primary" /> Financial Ledger
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-secondary/30 p-2.5 rounded-xl border border-border">
                        <div>
                          <p className="text-muted-foreground">Total Invoiced</p>
                          <p className="font-bold text-xs text-foreground mt-0.5">
                            {formatINR(totalBilled)}
                          </p>
                        </div>
                        <div>
                          <p className="text-emerald-700">Total Paid</p>
                          <p className="font-bold text-xs text-emerald-600 mt-0.5">
                            {formatINR(totalPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-rose-700">Balance Due</p>
                          <p
                            className={`font-bold text-xs mt-0.5 ${ledgerBalance > 0 ? "text-rose-600" : "text-slate-500"}`}
                          >
                            {formatINR(ledgerBalance)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Passport & Visa Records */}
                    <div className="space-y-3 border-t border-border pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        Passport & Visa Records
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="passport">Passport Number</Label>
                          <Input
                            id="passport"
                            value={editPassport}
                            onChange={(e) => setEditPassport(e.target.value)}
                            placeholder="e.g. Z1234567"
                            className="h-9 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Passport Expiry</Label>
                          <Input
                            id="expiry"
                            type="date"
                            value={editExpiry}
                            onChange={(e) => setEditExpiry(e.target.value)}
                            className="h-9 text-xs mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="visa">Visa Status</Label>
                        <select
                          id="visa"
                          value={editVisa}
                          onChange={(e) => setEditVisa(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                        >
                          <option value="Not Applied">Not Applied</option>
                          <option value="Applied / In Process">Applied / In Process</option>
                          <option value="Visa Approved">Visa Approved</option>
                          <option value="Visa Rejected">Visa Rejected</option>
                        </select>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          setCustomerList((prev) =>
                            prev.map((c) =>
                              c.id === selectedCustomer.id
                                ? {
                                    ...c,
                                    passportNumber: editPassport,
                                    passportExpiry: editExpiry,
                                    visaStatus: editVisa,
                                  }
                                : c,
                            ),
                          );
                          setDialogType(null);
                        }}
                      >
                        Save Records
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}

          {dialogType === "history" && selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>Booking History</DialogTitle>
                <DialogDescription>
                  Past and upcoming trips for {selectedCustomer.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
                {bookings.filter((b) => b.customer === selectedCustomer.name).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 bg-secondary/20 rounded-xl border border-border border-dashed">
                    No booking history found for this customer.
                  </p>
                ) : (
                  bookings
                    .filter((b) => b.customer === selectedCustomer.name)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-border bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-sm leading-tight">{booking.package}</p>
                          <span
                            className={`shrink-0 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : booking.status === "Completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end text-xs">
                          <p className="text-muted-foreground font-medium">
                            Travels on:
                            <br />
                            <span className="text-foreground">{booking.travelDate}</span>
                          </p>
                          <div className="text-right">
                            <p className="text-muted-foreground font-medium">Amount:</p>
                            <p className="font-display font-bold text-sm text-primary">
                              {formatINR(booking.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </>
          )}

          {dialogType === "delete" && selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete Customer
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{selectedCustomer.name}</strong>? This
                  action will remove them from the list and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDialogType(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCustomerList(customerList.filter((c) => c.id !== selectedCustomer.id));
                    setDialogType(null);
                  }}
                >
                  Yes, delete customer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
