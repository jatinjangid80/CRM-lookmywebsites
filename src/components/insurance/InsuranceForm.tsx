import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar as CalendarIcon, Upload, Search, Building2, Car, Shield, Banknote, HelpCircle, Users } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";

export function InsuranceForm({ 
  onClose, 
  onSave,
  initialData = null 
}: { 
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}) {
  const [customers] = useSupabaseTable<any[]>("customers", []);
  const [companies] = useSupabaseTable<any[]>("insurance_companies", []);
  const [vendors] = useSupabaseTable<any[]>("insurance_vendors", []);
  
  const [form, setForm] = useState<any>({
    school_name: "",
    reference_name: "",
    customer_name: "",
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
    notes: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData });
    }
  }, [initialData]);

  // Auto Calculations
  useEffect(() => {
    const net = Number(form.net_premium) || 0;
    const gst = Number(form.gst) || 0;
    setForm((f: any) => ({ ...f, total_premium: net + gst }));
  }, [form.net_premium, form.gst]);

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
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="h-full w-full max-w-4xl bg-background shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
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
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Policy
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-8">
          
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
                    <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                          <div 
                            key={c.id} 
                            className="p-2 hover:bg-slate-50 cursor-pointer text-sm flex justify-between"
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
                  onChange={(e) => setForm({...form, school_name: e.target.value})}
                  placeholder="E.g. DPS"
                />
              </div>
              <div className="space-y-1">
                <Label>Reference Name</Label>
                <Input 
                  value={form.reference_name}
                  onChange={(e) => setForm({...form, reference_name: e.target.value})}
                  placeholder="Referred by..."
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Customer Name</Label>
                <Input 
                  value={form.customer_name}
                  onChange={(e) => setForm({...form, customer_name: e.target.value})}
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Mobile Number</Label>
                <Input 
                  value={form.mobile_number}
                  onChange={(e) => setForm({...form, mobile_number: e.target.value})}
                  placeholder="+91..."
                />
              </div>
              <div className="space-y-1">
                <Label>Alt. Mobile</Label>
                <Input 
                  value={form.alternate_mobile}
                  onChange={(e) => setForm({...form, alternate_mobile: e.target.value})}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input 
                  value={form.city}
                  onChange={(e) => setForm({...form, city: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <Input 
                  value={form.state}
                  onChange={(e) => setForm({...form, state: e.target.value})}
                />
              </div>
              <div className="space-y-1 col-span-4">
                <Label>Address</Label>
                <Input 
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                />
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
                  onChange={(e) => setForm({...form, company_id: e.target.value})}
                >
                  <option value="">Select Company</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Vendor</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.vendor_id}
                  onChange={(e) => setForm({...form, vendor_id: e.target.value})}
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(v => (
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
                  onChange={(e) => setForm({...form, policy_number: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Issue Date</Label>
                <Input 
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm({...form, issue_date: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Expiry Date</Label>
                <Input 
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => setForm({...form, expiry_date: e.target.value})}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Vehicle Number</Label>
                <Input 
                  value={form.vehicle_number}
                  onChange={(e) => setForm({...form, vehicle_number: e.target.value})}
                  placeholder="e.g. MH 01 AB 1234"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Vehicle Model</Label>
                <Input 
                  value={form.vehicle_model}
                  onChange={(e) => setForm({...form, vehicle_model: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <Label>Fuel Type</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.fuel_type}
                  onChange={(e) => setForm({...form, fuel_type: e.target.value})}
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>EV</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Seating Capacity</Label>
                <Input 
                  type="number"
                  value={form.seating_capacity}
                  onChange={(e) => setForm({...form, seating_capacity: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Engine Number</Label>
                <Input 
                  value={form.engine_number}
                  onChange={(e) => setForm({...form, engine_number: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Chassis Number</Label>
                <Input 
                  value={form.chassis_number}
                  onChange={(e) => setForm({...form, chassis_number: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <Label>Registration Date</Label>
                <Input 
                  type="date"
                  value={form.registration_date}
                  onChange={(e) => setForm({...form, registration_date: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Policy Type</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.policy_type}
                  onChange={(e) => setForm({...form, policy_type: e.target.value})}
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
                  onChange={(e) => setForm({...form, idv_value: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>NCB %</Label>
                <Input 
                  type="number"
                  value={form.ncb_percentage}
                  onChange={(e) => setForm({...form, ncb_percentage: e.target.value})}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Previous Insurer</Label>
                <Input 
                  value={form.previous_insurer}
                  onChange={(e) => setForm({...form, previous_insurer: e.target.value})}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Previous Policy No.</Label>
                <Input 
                  value={form.previous_policy_number}
                  onChange={(e) => setForm({...form, previous_policy_number: e.target.value})}
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
                  onChange={(e) => setForm({...form, od_premium: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>TP Premium</Label>
                <Input 
                  type="number"
                  value={form.tp_premium}
                  onChange={(e) => setForm({...form, tp_premium: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Net Premium</Label>
                <Input 
                  type="number"
                  value={form.net_premium}
                  onChange={(e) => setForm({...form, net_premium: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>GST</Label>
                <Input 
                  type="number"
                  value={form.gst}
                  onChange={(e) => setForm({...form, gst: e.target.value})}
                />
              </div>
              <div className="space-y-1 bg-blue-50 p-2 rounded-lg border border-blue-100">
                <Label className="text-blue-700">Total Premium</Label>
                <p className="text-lg font-bold text-blue-700 pt-1">₹{form.total_premium}</p>
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
                  onChange={(e) => setForm({...form, customer_paid: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Vendor Paid</Label>
                <Input 
                  type="number"
                  value={form.vendor_paid}
                  onChange={(e) => setForm({...form, vendor_paid: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Payment Mode</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.payment_mode}
                  onChange={(e) => setForm({...form, payment_mode: e.target.value})}
                >
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Online Link</option>
                </select>
              </div>
              <div className={`space-y-1 p-2 rounded-lg border flex flex-col justify-center ${form.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <Label className={form.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}>Calculated Profit</Label>
                <p className={`text-lg font-bold pt-1 ${form.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ₹{form.profit}
                </p>
              </div>

              <div className="space-y-1 col-span-2">
                <Label>Transaction Ref.</Label>
                <Input 
                  value={form.transaction_reference}
                  onChange={(e) => setForm({...form, transaction_reference: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label>Payment Date</Label>
                <Input 
                  type="date"
                  value={form.payment_date}
                  onChange={(e) => setForm({...form, payment_date: e.target.value})}
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
