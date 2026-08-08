import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar as CalendarIcon, Upload, Search, Building2, Car, Shield, Banknote, HelpCircle, Users, Plus, Trash2, Paperclip } from "lucide-react";
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
  const [folders, setFolders] = useSupabaseTable<any[]>("folders", []);
``
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
    client_company: "",
    school_name: "",
    reference_name: "",
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

    customer_discount_type: "flat",
    customer_discount_percent: "",
    customer_discount_amount: "",
    customer_paid: 0,
    vendor_paid: 0,
    profit: 0,
    payment_date: "",
    payment_mode: "Bank Transfer",
    transaction_reference: "",
    payment_status: "Pending",
    notes: "",
    paid_by: "",
    amount_paid: 0,
    remark: "",
    policy_copy: null,
    RC_copy: null,
    PAN_card_copy: null
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData });
    }
  }, [initialData]);

  // Auto Calculations
  const handleChangeWithCalc = (updates: any) => {
    setForm((prev: any) => {
      const next = { ...prev, ...updates };
      
      if ('od_premium' in updates || 'tp_premium' in updates) {
        next.net_premium = (Number(next.od_premium) || 0) + (Number(next.tp_premium) || 0);
      }
      
      if ('od_premium' in updates || 'tp_premium' in updates || 'net_premium' in updates || 'gst_percentage' in updates || 'gst' in updates) {
        const net = Number(next.net_premium) || 0;
        if (!('gst' in updates)) {
          const gstPct = next.gst_percentage !== undefined && next.gst_percentage !== null ? Number(next.gst_percentage) : 18;
          next.gst = Math.round(net * (gstPct / 100));
        }
        next.total_premium = net + (Number(next.gst) || 0);
        
        // Auto-calculate discount amount if percentage is set
        if (Number(next.customer_discount_percent) > 0) {
          next.customer_discount_amount = Math.round(next.total_premium * (Number(next.customer_discount_percent) / 100));
        }
        // Auto-adjust customer_paid based on new total and discount
        next.customer_paid = Math.max(0, next.total_premium - (Number(next.customer_discount_amount) || 0));
      }
      
      if ('customer_discount_percent' in updates || 'customer_discount_amount' in updates) {
        const total = Number(next.total_premium) || 0;
        if ('customer_discount_percent' in updates) {
          const pct = Number(updates.customer_discount_percent) || 0;
          next.customer_discount_amount = Math.round(total * (pct / 100));
        } else if ('customer_discount_amount' in updates) {
          const amt = Number(updates.customer_discount_amount) || 0;
          next.customer_discount_percent = total > 0 ? Number(((amt / total) * 100).toFixed(2)) : 0;
        }
        
        // Auto-adjust customer paid
        next.customer_paid = Math.max(0, total - (Number(next.customer_discount_amount) || 0));
      } else if ('customer_paid' in updates) {
        // Auto-adjust discount if customer paid changes manually
        const total = Number(next.total_premium) || 0;
        const paid = Number(updates.customer_paid) || 0;
        next.customer_discount_amount = Math.max(0, total - paid);
        next.customer_discount_percent = total > 0 ? Number(((next.customer_discount_amount / total) * 100).toFixed(2)) : 0;
      }
      
      if ('customer_paid' in updates || 'vendor_paid' in updates || 'customer_discount_percent' in updates || 'customer_discount_amount' in updates || 'od_premium' in updates || 'tp_premium' in updates || 'net_premium' in updates || 'gst_percentage' in updates || 'gst' in updates) {
        next.profit = (Number(next.customer_paid) || 0) - (Number(next.vendor_paid) || 0);
      }
      
      if ('customer_paid' in updates || 'amount_paid' in updates || 'customer_discount_percent' in updates || 'customer_discount_amount' in updates || 'od_premium' in updates || 'tp_premium' in updates || 'net_premium' in updates || 'gst_percentage' in updates || 'gst' in updates) {
        const expected = Number(next.customer_paid) || 0;
        const actual = Number(next.amount_paid) || 0;
        const outstanding = Math.max(expected - actual, 0);
        
        let status = "Pending";
        if (expected > 0 && outstanding === 0) {
          status = "Full Paid";
        } else if (actual > 0) {
          status = "Partial";
        }
        next.payment_status = status;
      }
      
      return next;
    });
  };

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

  const handleSave = async () => {
    const payload = { ...form };
    
    // Auto-save attachments to Documents
    const filesToUpload: { file: File, type: string }[] = [];
    if (form.policy_copy instanceof File) filesToUpload.push({ file: form.policy_copy, type: "Policy Copy" });
    if (form.RC_copy instanceof File) filesToUpload.push({ file: form.RC_copy, type: "RC Copy" });
    if (form.PAN_card_copy instanceof File) filesToUpload.push({ file: form.PAN_card_copy, type: "PAN Card Copy" });

    if (filesToUpload.length > 0) {
      const passengerName = payload.customer_name || payload.client_company || payload.reference_name || "Unknown Insurance Customer";
      let targetFolder = folders.find((f: any) => f.name === passengerName);
      let isNewFolder = false;
      if (!targetFolder) {
        targetFolder = {
          id: `F-${Date.now().toString(36)}`,
          name: passengerName,
          color: "bg-emerald-100 text-emerald-600 border-emerald-200",
          iconColor: "#10b981",
          createdAt: new Date().toISOString(),
          description: `Insurance for ${passengerName}`,
          files: [],
        };
        isNewFolder = true;
      }

      const newFiles = await Promise.all(filesToUpload.map(async ({ file }) => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        return {
          id: `U-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          dataUrl,
        };
      }));

      const updatedFolder = {
        ...targetFolder,
        files: [...(targetFolder.files || []), ...newFiles],
      };

      if (isNewFolder) {
        setFolders((prev: any) => [...prev, updatedFolder]);
      } else {
        setFolders((prev: any) => prev.map((f: any) => f.id === updatedFolder.id ? updatedFolder : f));
      }
    }

    if (payload.policy_copy instanceof File) payload.policy_copy = payload.policy_copy.name;
    if (payload.RC_copy instanceof File) payload.RC_copy = payload.RC_copy.name;
    if (payload.PAN_card_copy instanceof File) payload.PAN_card_copy = payload.PAN_card_copy.name;

    // Scrub empty strings to null for UUIDs, dates, and numbers
    const fieldsToScrub = [
      "customer_id", "company_id", "vendor_id", 
      "registration_date", "payment_date", "issue_date", "expiry_date",
      "seating_capacity", "idv_value", "ncb_percentage",
      "od_premium", "tp_premium", "net_premium", "gst", "total_premium", 
      "customer_discount_percent", "customer_discount_amount",
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

  const [blink, setBlink] = useState(false);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isVendorModalOpen || isAddingVendor) {
          // Inner modal is active, don't close the parent.
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVendorModalOpen, isAddingVendor, onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div className={`w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl bg-background shadow-2xl animate-in zoom-in-95 transition-all duration-150 flex flex-col ${blink ? "scale-[1.02] ring-4 ring-primary/40 opacity-90" : ""}`}>
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
              <div className="space-y-1 col-span-2">
                <Label>Client / Company</Label>
                <Input
                  value={form.client_company}
                  onChange={(e) => setForm({ ...form, client_company: e.target.value })}
                  placeholder="e.g. Acme Corp or Customer Name"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>School Name</Label>
                <Input
                  value={form.school_name}
                  onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                  placeholder="e.g. Genius Public School"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Reference Name</Label>
                <Input
                  value={form.reference_name}
                  onChange={(e) => setForm({ ...form, reference_name: e.target.value })}
                  placeholder="Referred By"
                />
              </div>


              <div className="space-y-1 col-span-2">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Customer Name</Label>
                <Input
                  list="insurance-customers-list"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Full Name"
                />
                <datalist id="insurance-customers-list">
                  {customers?.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
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
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/10">
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
                          className="rounded-full px-6"
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
                  onChange={(e) => handleChangeWithCalc({ od_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>TP Premium</Label>
                <Input
                  type="number"
                  value={form.tp_premium}
                  onChange={(e) => handleChangeWithCalc({ tp_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Net Premium</Label>
                <Input
                  type="number"
                  value={form.net_premium}
                  onChange={(e) => handleChangeWithCalc({ net_premium: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>GST</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.gst_percentage !== undefined && form.gst_percentage !== null ? form.gst_percentage : 18}
                  onChange={(e) => handleChangeWithCalc({ gst_percentage: Number(e.target.value) })}
                >
                  <option value="18">18%</option>
                  <option value="0">0%</option>
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
                <Label>Customer Discount</Label>
                <div className="flex">
                  <select
                    className="flex h-9 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none font-medium"
                    value={form.customer_discount_type || "flat"}
                    onChange={(e) => setForm({ ...form, customer_discount_type: e.target.value })}
                  >
                    <option value="flat">₹ Flat</option>
                    <option value="percent">% Perc</option>
                  </select>
                  <Input
                    type="number"
                    className="rounded-l-none pl-3"
                    value={form.customer_discount_type === 'percent' ? form.customer_discount_percent : form.customer_discount_amount}
                    onChange={(e) => {
                      if (form.customer_discount_type === 'percent') {
                        handleChangeWithCalc({ customer_discount_percent: e.target.value });
                      } else {
                        handleChangeWithCalc({ customer_discount_amount: e.target.value });
                      }
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Customer Paid Amounts</Label>
                </div>
                <Input
                  type="number"
                  value={form.customer_paid}
                  onChange={(e) => handleChangeWithCalc({ customer_paid: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Vendor Paid</Label>
                <Input
                  type="number"
                  value={form.vendor_paid}
                  onChange={(e) => handleChangeWithCalc({ vendor_paid: e.target.value })}
                />
              </div>

              <div className={`space-y-1 p-2 rounded-lg border flex flex-col justify-center ${form.profit >= 0 ? 'bg-emerald-500/100/10 border-emerald-500/20' : 'bg-rose-500/100/10 border-rose-500/20'}`}>
                <Label className={form.profit >= 0 ? 'text-emerald-700' : 'text-rose-500'}>Calculated Profit</Label>
                <p className={`text-lg font-bold pt-1 ${form.profit >= 0 ? 'text-emerald-700' : 'text-rose-500'}`}>
                  ₹{form.profit}
                </p>
              </div>

              <div className="space-y-1 col-span-2 md:col-span-4">
                <Label>Transaction Ref.</Label>
                <Input
                  value={form.transaction_reference}
                  onChange={(e) => setForm({ ...form, transaction_reference: e.target.value })}
                  placeholder="Enter transaction reference"
                />
              </div>

            </div>
          </section>

          {/* Section 6: Attachments & Remarks */}
          <section className="bg-muted/30 p-5 rounded-2xl border border-border shadow-sm mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Paperclip className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-sm">6. Attachments & Remarks</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Attachments</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <span className="text-sm font-medium">1. Policy Copy</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('upload-policy-copy')?.click()}
                    >
                      <Paperclip className="h-3 w-3 mr-2" />
                      {form.policy_copy ? "Change File" : "Upload File"}
                    </Button>
                    <input 
                      type="file" 
                      id="upload-policy-copy" 
                      className="hidden" 
                      onChange={(e) => setForm({...form, policy_copy: e.target.files?.[0] || null})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <span className="text-sm font-medium">2. RC Copy</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('upload-rc-copy')?.click()}
                    >
                      <Paperclip className="h-3 w-3 mr-2" />
                      {form.RC_copy ? "Change File" : "Upload File"}
                    </Button>
                    <input 
                      type="file" 
                      id="upload-rc-copy" 
                      className="hidden" 
                      onChange={(e) => setForm({...form, RC_copy: e.target.files?.[0] || null})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <span className="text-sm font-medium">3. PAN Card Copy</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('upload-pan-copy')?.click()}
                    >
                      <Paperclip className="h-3 w-3 mr-2" />
                      {form.PAN_card_copy ? "Change File" : "Upload File"}
                    </Button>
                    <input 
                      type="file" 
                      id="upload-pan-copy" 
                      className="hidden" 
                      onChange={(e) => setForm({...form, PAN_card_copy: e.target.files?.[0] || null})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Remark</Label>
                <textarea
                  className="w-full min-h-[160px] p-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Add any remarks or notes..."
                  value={form.remark || ""}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
