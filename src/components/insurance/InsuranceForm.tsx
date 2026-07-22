import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar as CalendarIcon, Upload, Search, Building2, Car, Shield, Banknote, HelpCircle, Users, Plus, Trash2 } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export function InsuranceForm({
  onClose,
  onSave,
  initialData = null,
  companies = [],
  vendors = [],
  policies = []
}: {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  companies?: any[];
  vendors?: any[];
  policies?: any[];
}) {
  const [customers] = useSupabaseTable<any[]>("customers", []);

  const [newVendor, setNewVendor] = useState({ 
    name: "", contact_person: "", mobile: "", alternate_mobile: "", 
    email: "", office_city: "", website: "", address: "", 
    gst_number: "", pan_number: "", category: "" 
  });
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [localAddedVendors, setLocalAddedVendors] = useState<any[]>([]);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const handleAddVendor = async () => {
    if (!newVendor.name.trim() || !newVendor.mobile.trim()) return;
    setIsAddingVendor(true);
    const newId = crypto.randomUUID();
    const vendorPayload = { id: newId, ...newVendor, created_at: new Date().toISOString() };
    const { error } = await supabase.from("insurance_vendors").insert([vendorPayload]);
    setIsAddingVendor(false);
    if (error) {
      toast.error("Failed to add vendor: " + error.message);
    } else {
      toast.success("Vendor added successfully");
      setLocalAddedVendors([...localAddedVendors, vendorPayload]);
      setForm({ ...form, vendor_id: newId });
      setNewVendor({ 
        name: "", contact_person: "", mobile: "", alternate_mobile: "", 
        email: "", office_city: "", website: "", address: "", 
        gst_number: "", pan_number: "", category: "" 
      });
      setIsVendorModalOpen(false);
    }
  };

  const [form, setForm] = useState<any>({
    school_name: "",
    reference_name: "",
    client_company: "",
    customer_name: "",
    additional_passengers: [],
    mobile_number: "",
    alternate_mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    customer_id: null,

    company_id: "",
    vendor_id: "",

    policy_number: "",
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: "",
    vehicle_number: "",
    vehicle_model: "",
    seating_capacity: "",
    chassis_number: "",
    engine_number: "",
    fuel_type: "Petrol",
    registration_date: "",
    policy_type: "Comprehensive",
    idv_value: "",
    previous_policy_number: "",
    previous_insurer: "",
    ncb_percentage: "",

    od_premium: 0,
    tp_premium: 0,
    net_premium: 0,
    gst: 0,
    total_premium: 0,

    customer_paid: 0,
    vendor_paid: 0,
    profit: 0,
    payment_date: "",
    payment_mode: "Bank Transfer",
    transaction_reference: "",
    payment_status: "Pending",
    notes: "",
    paid_by: "",
    amount_paid: 0
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData });
    }
  }, [initialData]);

  // Auto Calculations
  useEffect(() => {
    const od = Number(form.od_premium) || 0;
    const tp = Number(form.tp_premium) || 0;
    const calculatedNet = od + tp;
    setForm((f: any) => {
      // Only auto-update net if it actually equals the sum, so we don't override manual edits
      if (f.net_premium === calculatedNet) return f;
      return { ...f, net_premium: calculatedNet };
    });
  }, [form.od_premium, form.tp_premium]);

  useEffect(() => {
    const net = Number(form.net_premium) || 0;
    const gstPct = Number(form.gst_percentage) || 18;
    const calculatedGst = Math.round(net * (gstPct / 100));
    setForm((f: any) => {
      if (f.gst === calculatedGst && f.total_premium === net + calculatedGst) return f;
      return { ...f, gst: calculatedGst, total_premium: net + calculatedGst };
    });
  }, [form.net_premium, form.gst_percentage]);

  useEffect(() => {
    const net = Number(form.net_premium) || 0;
    const gst = Number(form.gst) || 0;
    setForm((f: any) => {
      if (f.total_premium === net + gst) return f;
      return { ...f, total_premium: net + gst };
    });
  }, [form.gst]);

  useEffect(() => {
    const custPaid = Number(form.customer_paid) || 0;
    const vendPaid = Number(form.vendor_paid) || 0;
    setForm((f: any) => ({ ...f, profit: custPaid - vendPaid }));
  }, [form.customer_paid, form.vendor_paid]);

  useEffect(() => {
    const total = Number(form.total_premium) || 0;
    const paid = Number(form.customer_paid) || 0;
    let status = "Pending";
    if (paid > 0) {
      if (paid >= total && total > 0) status = "Full Paid";
      else status = "Partial";
    }
    setForm((f: any) => ({ ...f, payment_status: status }));
  }, [form.customer_paid, form.total_premium]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone?.includes(customerSearch)
  ).slice(0, 5);

  const selectCustomer = (c: any) => {
    setForm({
      ...form,
      customer_id: c.id,
      customer_name: c.name || "",
      mobile_number: c.phone || "",
      email: c.email || "",
      address: c.address || "",
    });
    setCustomerSearch("");
    setShowCustomerDropdown(false);
  };

  const handleSave = () => {
    const payload = { ...form };
    
    // Scrub empty strings to null for UUIDs, dates, and numbers
    const fieldsToScrub = [
      "customer_id", "company_id", "vendor_id", 
      "registration_date", "payment_date", "issue_date", "expiry_date",
      "seating_capacity", "idv_value", "ncb_percentage",
      "od_premium", "tp_premium", "net_premium", "gst", "total_premium", 
      "customer_paid", "vendor_paid", "profit", "amount_paid"
    ];
    
    fieldsToScrub.forEach(field => {
      if (payload[field] === "") {
        payload[field] = null;
      }
    });

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    // If IDs are not valid UUIDs, move them to notes and set to null to avoid Supabase errors
    if (payload.customer_id && !isUUID(payload.customer_id)) {
      payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Customer ID: ${payload.customer_id}`;
      payload.customer_id = null;
    }
    if (payload.company_id && payload.company_id !== "other" && !isUUID(payload.company_id)) {
      payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Company: ${payload.company_id}`;
      payload.company_id = null;
    }
    if (payload.vendor_id && payload.vendor_id !== "other" && !isUUID(payload.vendor_id)) {
      payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Vendor: ${payload.vendor_id}`;
      payload.vendor_id = null;
    }

    if (payload.company_id === "other") {
      payload.company_id = null;
      if (payload.custom_company) {
        payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Custom Company: ${payload.custom_company}`;
      }
    }
    
    if (payload.vendor_id === "other") {
      payload.vendor_id = null;
      if (payload.custom_vendor) {
        payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Custom Vendor: ${payload.custom_vendor}`;
      }
    }

    delete payload.custom_company;
    delete payload.custom_vendor;
    delete payload.gst_percentage;
    
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-6">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl bg-background shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData ? "Edit Insurance Policy" : "New General Insurance"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Enter policy and vehicle details.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Policy
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30 space-y-8">

          {/* Section 1: Customer & Reference */}
          <section className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-sm">1. Customer & Reference Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 relative">
                <Label>Search Existing Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    className="pl-9"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                  />
                  {showCustomerDropdown && customerSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                          <div
                            key={c.id}
                            className="p-2 hover:bg-muted cursor-pointer text-sm flex justify-between"
                            onClick={() => selectCustomer(c)}
                          >
                            <span className="font-medium">{c.name}</span>
                            <span className="text-muted-foreground">{c.phone}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">No matching customers</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>School Name</Label>
                <Input
                  value={form.school_name}
                  onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                  placeholder="E.g. DPS"
                />
              </div>
              <div className="space-y-1">
                <Label>Reference Name</Label>
                <Input
                  value={form.reference_name}
                  onChange={(e) => setForm({ ...form, reference_name: e.target.value })}
                  placeholder="Referred by..."
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Client / Company</Label>
                <Input
                  value={form.client_company}
                  onChange={(e) => setForm({ ...form, client_company: e.target.value })}
                  placeholder="e.g. Acme Corp or Customer Name"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Customer Name</Label>
                <Input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Mobile Number</Label>
                <Input
                  value={form.mobile_number}
                  onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                  placeholder="+91..."
                />
              </div>
              <div className="space-y-1">
                <Label>Alt. Mobile</Label>
                <Input
                  value={form.alternate_mobile}
                  onChange={(e) => setForm({ ...form, alternate_mobile: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-4">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-4">
                <div className="flex items-center justify-between">
                  <Label>Additional Passenger Names</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      const current = Array.isArray(form.additional_passengers) ? form.additional_passengers : [];
                      setForm({ ...form, additional_passengers: [...current, ""] });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Name
                  </Button>
                </div>
                {(Array.isArray(form.additional_passengers) ? form.additional_passengers : []).map((name: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      value={name}
                      onChange={(e) => {
                        const newNames = [...(form.additional_passengers as string[])];
                        newNames[index] = e.target.value;
                        setForm({ ...form, additional_passengers: newNames });
                      }}
                      placeholder="Passenger Name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newNames = form.additional_passengers.filter((_: any, i: number) => i !== index);
                        setForm({ ...form, additional_passengers: newNames });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Insurer & Vendor */}
          <section className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold text-sm">2. Insurer & Vendor</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Insurance Company</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.company_id}
                  onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                >
                  <option value="">Select Company</option>
                  {(companies || []).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label>Vendor</Label>
                  <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        + Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Vendor</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                        <div className="space-y-1">
                          <Label>Vendor Name *</Label>
                          <Input value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} placeholder="e.g. PolicyBazaar" />
                        </div>
                        <div className="space-y-1">
                          <Label>Contact Person</Label>
                          <Input value={newVendor.contact_person} onChange={e => setNewVendor({...newVendor, contact_person: e.target.value})} placeholder="e.g. John Doe" />
                        </div>
                        <div className="space-y-1">
                          <Label>Mobile *</Label>
                          <Input value={newVendor.mobile} onChange={e => setNewVendor({...newVendor, mobile: e.target.value})} placeholder="e.g. +91 9876543210" />
                        </div>
                        <div className="space-y-1">
                          <Label>Alternate Mobile</Label>
                          <Input value={newVendor.alternate_mobile} onChange={e => setNewVendor({...newVendor, alternate_mobile: e.target.value})} placeholder="e.g. +91 9876543211" />
                        </div>
                        <div className="space-y-1">
                          <Label>Email</Label>
                          <Input type="email" value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} placeholder="e.g. contact@vendor.com" />
                        </div>
                        <div className="space-y-1">
                          <Label>Website</Label>
                          <Input value={newVendor.website} onChange={e => setNewVendor({...newVendor, website: e.target.value})} placeholder="e.g. www.vendor.com" />
                        </div>
                        <div className="space-y-1">
                          <Label>Office City</Label>
                          <Input value={newVendor.office_city} onChange={e => setNewVendor({...newVendor, office_city: e.target.value})} placeholder="e.g. Mumbai" />
                        </div>
                        <div className="space-y-1">
                          <Label>Category</Label>
                          <Select value={newVendor.category} onValueChange={(val) => setNewVendor({...newVendor, category: val})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Insurance", "Hotel", "Transport", "Visa", "Flights", "Travel Insurance", "Forex", "Activities", "Other"].map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label>GST Number</Label>
                          <Input value={newVendor.gst_number} onChange={e => setNewVendor({...newVendor, gst_number: e.target.value})} placeholder="e.g. 22AAAAA0000A1Z5" />
                        </div>
                        <div className="space-y-1">
                          <Label>PAN Number</Label>
                          <Input value={newVendor.pan_number} onChange={e => setNewVendor({...newVendor, pan_number: e.target.value})} placeholder="e.g. ABCDE1234F" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <Button 
                          type="button" 
                          onClick={handleAddVendor} 
                          disabled={!newVendor.name.trim() || !newVendor.mobile.trim() || isAddingVendor}
                          className="bg-rose-400 hover:bg-rose-500 text-white rounded-full px-6"
                        >
                          {isAddingVendor ? "Adding..." : "Add Vendor"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.vendor_id}
                  onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
                >
                  <option value="">Select Vendor</option>
                  {(vendors || []).concat(localAddedVendors).map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Policy & Vehicle Details */}
          <section className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-sm">3. Policy & Vehicle Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1 col-span-2">
                <Label>Policy Number</Label>
                <Input
                  value={form.policy_number}
                  onChange={(e) => setForm({ ...form, policy_number: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Vehicle Number</Label>
                <Input
                  value={form.vehicle_number}
                  onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                  placeholder="e.g. MH 01 AB 1234"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Vehicle Model</Label>
                <Input
                  value={form.vehicle_model}
                  onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Seating Capacity</Label>
                <Input
                  type="number"
                  value={form.seating_capacity}
                  onChange={(e) => setForm({ ...form, seating_capacity: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Registration Date</Label>
                <Input
                  type="date"
                  value={form.registration_date}
                  onChange={(e) => setForm({ ...form, registration_date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Policy Type</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.policy_type}
                  onChange={(e) => setForm({ ...form, policy_type: e.target.value })}
                >
                  <option>Comprehensive</option>
                  <option>Third Party</option>
                  <option>Stand Alone OD</option>
                  <option>Health</option>
                  <option>Term Life</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>IDV Value</Label>
                <Input
                  type="number"
                  value={form.idv_value}
                  onChange={(e) => setForm({ ...form, idv_value: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Previous Policy No.</Label>
                <Input
                  value={form.previous_policy_number}
                  onChange={(e) => setForm({ ...form, previous_policy_number: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label>Previous Insurer</Label>
                <Input
                  value={form.previous_insurer}
                  onChange={(e) => setForm({ ...form, previous_insurer: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label>NCB %</Label>
                <Input
                  type="number"
                  value={form.ncb_percentage}
                  onChange={(e) => setForm({ ...form, ncb_percentage: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section 4: Premium Details */}
          <section className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-sm">4. Premium Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <Label>OD Premium</Label>
                <Input
                  type="number"
                  value={form.od_premium}
                  onChange={(e) => setForm({ ...form, od_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>TP Premium</Label>
                <Input
                  type="number"
                  value={form.tp_premium}
                  onChange={(e) => setForm({ ...form, tp_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Net Premium</Label>
                <Input
                  type="number"
                  value={form.net_premium}
                  onChange={(e) => setForm({ ...form, net_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>GST</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.gst_percentage || 18}
                  onChange={(e) => setForm({ ...form, gst_percentage: Number(e.target.value) })}
                >
                  <option value="18">18%</option>
                </select>
              </div>
              <div className="space-y-1 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <Label className="text-blue-500">Total Premium</Label>
                <p className="text-lg font-bold text-blue-500 pt-1">₹{form.total_premium}</p>
              </div>
            </div>
          </section>

          {/* Section 5: Payment Details & Profit */}
          <section className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-sm">5. Payment Details & Profit</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label>Customer Paid</Label>
                <Input
                  type="number"
                  value={form.customer_paid}
                  onChange={(e) => setForm({ ...form, customer_paid: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Paid By</Label>
                <Input
                  value={form.paid_by || ""}
                  onChange={(e) => setForm({ ...form, paid_by: e.target.value })}
                  placeholder="Who made the payment?"
                />
              </div>
              <div className="space-y-1">
                <Label>Amount Paid</Label>
                <Input
                  type="number"
                  value={form.amount_paid || ""}
                  onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <Label>Vendor Paid</Label>
                <Input
                  type="number"
                  value={form.vendor_paid}
                  onChange={(e) => setForm({ ...form, vendor_paid: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Payment Mode</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.payment_mode}
                  onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                >
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Online Link</option>
                </select>
              </div>
              <div className={`space-y-1 p-2 rounded-lg border flex flex-col justify-center ${form.profit >= 0 ? 'bg-emerald-500/100/10 border-emerald-500/20' : 'bg-rose-500/100/10 border-rose-500/20'}`}>
                <Label className={form.profit >= 0 ? 'text-emerald-700' : 'text-rose-500'}>Calculated Profit</Label>
                <p className={`text-lg font-bold pt-1 ${form.profit >= 0 ? 'text-emerald-700' : 'text-rose-500'}`}>
                  ₹{form.profit}
                </p>
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Transaction Ref.</Label>
                <Input
                  value={form.transaction_reference}
                  onChange={(e) => setForm({ ...form, transaction_reference: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={form.payment_date}
                  onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <p className="font-semibold text-sm mt-2 uppercase tracking-wider">{form.payment_status}</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
