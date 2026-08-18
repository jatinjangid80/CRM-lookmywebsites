import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload, Plus, Check, ChevronsUpDown } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/taxi-booking")({
  component: TaxiBookingPage,
});

function TaxiBookingPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [bookings] = useSupabaseTable<any[]>("crm_taxi_bookings", []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Taxi Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage your taxi and cab reservations.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cabs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(bookings.map((b: any) => b.vehicle_no).filter(Boolean)).size || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {bookings.reduce((sum: number, b: any) => sum + (Number(b.selling_price) || 0), 0).toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                    <TableCell>{b.route}</TableCell>
                    <TableCell>{b.travel_date}</TableCell>
                    <TableCell>₹ {b.selling_price || 0}</TableCell>
                    <TableCell className="text-emerald-600 font-semibold">₹ {b.profit || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0 border-0 [&>button]:hidden">
          <div className="bg-background">
            <AddTaxiBookingForm onCancel={() => setIsAdding(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddTaxiBookingForm({ onCancel }: { onCancel: () => void }) {
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [customers] = useSupabaseTable<any[]>("customers", []);
  
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [form, setForm] = useState<any>({
    supplier: "",
    booking_date: new Date().toISOString().split('T')[0],
    customer_name: "",
    mobile_number: "",
    email_address: "",
    booked_by: "",
    reference: "",
    pricing_type: "day-wise",
    travel_date: "",
    route: "",
    vehicle_type: "",
    vehicle_no: "",
    rate: 0,
    total_quantity: 0,
    extra_charges: 0,
    selling_price: 0,
    purchase_price: 0,
    bank_details: "",
    remarks: "",
  });

  const handleChange = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.supplier || !form.travel_date) {
      toast.error("Please fill all required fields (Supplier, Customer, Travel Date)");
      return;
    }

    try {
      const payload = {
        id: "TX-" + Math.random().toString(36).substring(2, 9),
        ...form,
        profit: (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("crm_taxi_bookings").upsert([payload]);
      if (error) throw error;

      toast.success("Taxi Booking saved successfully");
      onCancel();
    } catch (err: any) {
      toast.error("Failed to save booking: " + err.message);
    }
  };

  const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">New Taxi Booking</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier <span className="text-destructive">*</span></Label>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={supplierOpen} className="w-full justify-between font-normal text-left">
                      <span className="truncate">{form.supplier || "Select a supplier..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search supplier..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No supplier found.</CommandEmpty>
                        <CommandGroup>
                          {vendors?.map((v) => (
                            <CommandItem key={v.id || v.name} value={`${v.name} ${v.mobile || ""} ${v.id || ""}`} onSelect={() => { handleChange({ supplier: v.name }); setSupplierOpen(false); }}>
                              <div className="flex flex-col">
                                <span>{v.name}</span>
                                {v.mobile && <span className="text-xs text-muted-foreground">{v.mobile}</span>}
                              </div>
                              <Check className={cn("ml-auto h-4 w-4", form.supplier === v.name ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Booking Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.booking_date} onChange={(e) => handleChange({ booking_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer Name <span className="text-destructive">*</span></Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between font-normal text-left">
                      <span className="truncate">{form.customer_name || "Select a customer..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search customer..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers?.map((c) => (
                            <CommandItem key={c.id || c.name} value={`${c.name} ${c.mobile || ""} ${c.id || ""}`} onSelect={() => { 
                              handleChange({ customer_name: c.name, mobile_number: c.mobile || c.phone || "", email_address: c.email || "" }); 
                              setCustomerOpen(false); 
                            }}>
                              <div className="flex flex-col">
                                <span>{c.name}</span>
                                {c.mobile && <span className="text-xs text-muted-foreground">{c.mobile}</span>}
                              </div>
                              <Check className={cn("ml-auto h-4 w-4", form.customer_name === c.name ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number <span className="text-destructive">*</span></Label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.mobile_number} onChange={(e) => handleChange({ mobile_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input placeholder="Enter email address" value={form.email_address} onChange={(e) => handleChange({ email_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Booked By</Label>
                <Input placeholder="Agent/Employee name" value={form.booked_by} onChange={(e) => handleChange({ booked_by: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="day-wise" className="w-full" onValueChange={(val) => handleChange({ pricing_type: val })}>
                <TabsList className="grid w-full grid-cols-2 h-auto bg-[#FDF8F5] rounded-full p-1 border border-[#F2E8E3] mb-6">
                  <TabsTrigger value="day-wise" className="rounded-full py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#E12D39] data-[state=active]:shadow-sm">
                    Day Wise Pricing
                  </TabsTrigger>
                  <TabsTrigger value="km-wise" className="rounded-full py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#E12D39] data-[state=active]:shadow-sm">
                    KM Wise Pricing
                  </TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Travel Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location / City Route <span className="text-destructive">*</span></Label>
                    <Input placeholder="Delhi - Agra" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Input placeholder="Innova Crysta" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle No.</Label>
                    <Input placeholder="DL 1C AA 1111" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate</Label>
                    <Input type="number" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total (Days/KMs)</Label>
                    <Input type="number" value={form.total_quantity} onChange={(e) => handleChange({ total_quantity: e.target.value })} />
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 sticky top-6 self-start">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Selling Price (₹)</Label>
                  <Input type="number" placeholder="0" value={form.selling_price} onChange={(e) => handleChange({ selling_price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" placeholder="0" value={form.purchase_price} onChange={(e) => handleChange({ purchase_price: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 mt-2 rounded-xl border bg-[#faf9f8]">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Profit</p>
                  <p className="font-bold text-[#059669] text-xl">₹{profit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-background flex justify-end gap-2 py-4 border-t mt-8 -mx-6 px-6 -mb-6 z-10">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Booking</Button>
      </div>
    </div>
  );
}
