import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { X, Calendar as CalendarIcon, Building2, Users, Plus, Trash2, Paperclip, CreditCard, Flag, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COUNTRIES_LIST, COUNTRY_CODES } from "@/routes/crm.visa";

export function VisaBookingForm({
  onClose,
  onSave,
  initialData = null,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}) {
  const [customers] = useSupabaseTable<any[]>("customers", []);
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  const [form, setForm] = useState<any>({
    supplier: "",
    booking_date: new Date().toISOString().split('T')[0],
    customer_name: "",
    mobile_number: "",
    email_address: "",
    booked_by: "",
    reference: "",
    
    country: "",
    visa_type: "",
    process_date: "",
    application_status: "Pending",
    
    lead_passenger_name: "",
    additional_passenger_names: [],
    
    selling_price: 0,
    purchase_price: 0,
    visa_fees: 0,
    profit: 0,
    margin: 0,
    pending_amount: 0,
    
    bank_details: "",
    attachments_and_remarks: ""
  });

  useEffect(() => {
    if (initialData) {
      let remarksText = initialData.attachments_and_remarks || "";
      let attachName = "";
      
      try {
        const parsed = JSON.parse(remarksText);
        if (parsed && typeof parsed === "object" && parsed._isMeta) {
          remarksText = parsed.text || "";
          attachName = parsed.attachment_name || "";
        }
      } catch (e) {
        // It's just a plain string from before this feature
      }
      
      setForm({
        ...form,
        ...initialData,
        attachments_and_remarks: remarksText,
        additional_passenger_names: initialData.additional_passenger_names || []
      });
      
      if (attachName) {
        // We only need the name for the UI display when editing
        setAttachedFile(new File([], attachName));
      }
    }
  }, [initialData]);

  // Auto Calculations
  const handleChangeWithCalc = (updates: any) => {
    setForm((prev: any) => {
      const next = { ...prev, ...updates };
      
      if ('selling_price' in updates || 'purchase_price' in updates) {
        const selling = Number(next.selling_price) || 0;
        const purchase = Number(next.purchase_price) || 0;
        next.profit = selling - purchase;
        next.margin = selling > 0 ? ((next.profit / selling) * 100).toFixed(2) : 0;
      }
      
      return next;
    });
  };

  const handleCustomerSelect = (customerName: string) => {
    const selected = customers.find(c => c.name === customerName);
    if (selected) {
      handleChangeWithCalc({
        customer_name: selected.name,
        mobile_number: selected.phone || selected.mobile || "",
        email_address: selected.email || "",
      });
    } else {
      handleChangeWithCalc({ customer_name: customerName });
    }
  };

  const addPassenger = () => {
    setForm((prev: any) => ({
      ...prev,
      additional_passenger_names: [...prev.additional_passenger_names, ""]
    }));
  };

  const removePassenger = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      additional_passenger_names: prev.additional_passenger_names.filter((_: any, i: number) => i !== index)
    }));
  };

  const updatePassenger = (index: number, val: string) => {
    const updated = [...form.additional_passenger_names];
    updated[index] = val;
    handleChangeWithCalc({ additional_passenger_names: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier || !form.customer_name || !form.country || !form.visa_type) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const id = form.id || crypto.randomUUID();
      const payload = {
        id,
        supplier: form.supplier,
        booking_date: form.booking_date,
        customer_name: form.customer_name,
        mobile_number: form.mobile_number,
        booked_by: form.booked_by,
        reference: form.reference,
        country: form.country,
        visa_type: form.visa_type,
        process_date: form.process_date || null,
        application_status: form.application_status,
        lead_passenger_name: form.lead_passenger_name,
        additional_passenger_names: form.additional_passenger_names,
        selling_price: Number(form.selling_price) || 0,
        purchase_price: Number(form.purchase_price) || 0,
        visa_fees: Number(form.visa_fees) || 0,
        profit: Number(form.profit) || 0,
        margin: Number(form.margin) || 0,
        pending_amount: Number(form.pending_amount) || 0,
        bank_details: form.bank_details,
        attachments_and_remarks: JSON.stringify({
          _isMeta: true,
          text: form.attachments_and_remarks,
          attachment_name: attachedFile ? attachedFile.name : ""
        }),
        created_at: form.created_at || new Date().toISOString()
      };

      const { error } = await supabase.from("crm_visa_bookings").upsert([payload]);
      
      if (error) throw error;

      toast.success(initialData ? "Visa Booking updated successfully" : "Visa Booking created successfully");
      
      // Auto-save to Documents ONLY if it's a real, newly selected file
      if (attachedFile && attachedFile.size > 0) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const { data: remoteData } = await supabase.from("folders").select("*");
            const folders = remoteData || [];
            
            let visaFolder = folders.find((f: any) => f.name.trim().toLowerCase() === "visa booking");
            
            if (!visaFolder) {
              visaFolder = {
                id: "F-" + Math.random().toString(36).substring(2, 9),
                name: "Visa booking",
                color: "bg-blue-100 text-blue-600 border-blue-200",
                iconColor: "#3b82f6",
                createdAt: new Date().toISOString(),
                description: "Auto-generated from Visa Booking Form",
                files: [],
              };
            }

            let currentFiles = Array.isArray(visaFolder.files) ? visaFolder.files : (typeof visaFolder.files === "string" ? JSON.parse(visaFolder.files) : []);
            
            const newFile = {
              id: "U-" + Math.random().toString(36).substring(2, 9),
              name: form.customer_name ? `[${form.customer_name}] ${attachedFile.name}` : attachedFile.name,
              size: attachedFile.size,
              type: attachedFile.type || "application/octet-stream",
              uploadedAt: new Date().toISOString(),
              dataUrl: reader.result as string,
            };
            
            currentFiles.push(newFile);
            visaFolder.files = currentFiles;
            
            const { error: folderError } = await supabase.from("folders").upsert([visaFolder]);
            if (folderError) throw folderError;

            toast.success("Document also saved to Documents > Visa booking");
          } catch (err) {
            console.error("Failed to auto-save document", err);
          }
        };
        reader.readAsDataURL(attachedFile);
      }

      onSave(payload);
    } catch (err: any) {
      toast.error("Failed to save booking: " + err.message);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 sticky top-0 z-10 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              {initialData ? "Edit Visa Booking" : "New Visa Booking"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-8">
            
            {/* Common Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Common Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={supplierOpen}
                        className="w-full justify-between font-normal text-left"
                      >
                        <span className="truncate">
                          {form.supplier 
                            ? (form.supplier === "Self" || form.supplier === "Other" 
                              ? form.supplier 
                              : vendors.find((v: any) => v.name === form.supplier)?.name || form.supplier)
                            : "Select supplier..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search vendor..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No vendor found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="Self"
                              onSelect={() => {
                                handleChangeWithCalc({ supplier: "Self" })
                                setSupplierOpen(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.supplier === "Self" ? "opacity-100" : "opacity-0")} />
                              <span>Self</span>
                            </CommandItem>
                            
                            {vendors.map((v: any) => (
                              <CommandItem
                                key={v.id}
                                value={`${v.name} ${v.vendorType || ""} ${v.mobile || ""} ${v.email || ""}`}
                                onSelect={() => {
                                  handleChangeWithCalc({ supplier: v.name })
                                  setSupplierOpen(false)
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4 shrink-0", form.supplier === v.name ? "opacity-100" : "opacity-0")} />
                                <div className="flex flex-col overflow-hidden">
                                  <span className="truncate">{v.name} {v.vendorType ? <span className="text-muted-foreground text-xs ml-1">({v.vendorType})</span> : ""}</span>
                                  {(v.mobile || v.email) && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      {[v.mobile, v.email].filter(Boolean).join(" • ")}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                            
                            <CommandItem
                              value="Other"
                              onSelect={() => {
                                handleChangeWithCalc({ supplier: "Other" })
                                setSupplierOpen(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.supplier === "Other" ? "opacity-100" : "opacity-0")} />
                              <span>Other (Manual)</span>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Booking Date *</Label>
                  <Input 
                    type="date" 
                    value={form.booking_date}
                    onChange={(e) => handleChangeWithCalc({ booking_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={customerOpen}
                        className="w-full justify-between font-normal text-left"
                      >
                        <span className="truncate">
                          {form.customer_name 
                            ? customers.find((c: any) => c.name === form.customer_name)?.name || form.customer_name
                            : "Select a customer..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search customer..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No customer found.</CommandEmpty>
                          <CommandGroup>
                            {customers.map((c: any) => (
                              <CommandItem
                                key={c.id}
                                value={`${c.name} ${c.phone || c.mobile || ""} ${c.email || ""}`}
                                onSelect={() => {
                                  handleCustomerSelect(c.name)
                                  setCustomerOpen(false)
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4 shrink-0", form.customer_name === c.name ? "opacity-100" : "opacity-0")} />
                                <div className="flex flex-col overflow-hidden">
                                  <span className="truncate">{c.name}</span>
                                  {(c.phone || c.mobile || c.email) && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      {[c.phone || c.mobile, c.email].filter(Boolean).join(" • ")}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input 
                    placeholder="Enter mobile number" 
                    value={form.mobile_number}
                    onChange={(e) => handleChangeWithCalc({ mobile_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    placeholder="Enter email address" 
                    value={form.email_address}
                    onChange={(e) => handleChangeWithCalc({ email_address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Booked By</Label>
                  <Input 
                    placeholder="Enter booking agent" 
                    value={form.booked_by}
                    onChange={(e) => handleChangeWithCalc({ booked_by: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reference</Label>
                  <Input 
                    placeholder="Reference code or name" 
                    value={form.reference}
                    onChange={(e) => handleChangeWithCalc({ reference: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Flag className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Booking Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={countryOpen}
                        className="w-full justify-between font-normal text-left"
                      >
                        <span className="truncate flex items-center">
                          {form.country ? (
                            <>
                              <img
                                alt={COUNTRY_CODES[form.country]}
                                title={COUNTRY_CODES[form.country]}
                                src={`https://react-circle-flags.pages.dev/${COUNTRY_CODES[form.country] || "un"}.svg`}
                                className="mr-2 h-4 w-4 rounded-full"
                              />
                              {form.country}
                            </>
                          ) : (
                            "Select country..."
                          )}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search country..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {COUNTRIES_LIST.map((country: string) => (
                              <CommandItem
                                key={country}
                                value={country}
                                onSelect={() => {
                                  handleChangeWithCalc({ country: country })
                                  setCountryOpen(false)
                                }}
                                className="flex items-center w-full gap-2 px-2 py-1.5 text-sm"
                              >
                                <Check className={cn("mr-2 h-4 w-4 shrink-0", form.country === country ? "opacity-100" : "opacity-0")} />
                                <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full bg-secondary">
                                  <img
                                    height="20"
                                    width="20"
                                    alt={country}
                                    title={COUNTRY_CODES[country] || "un"}
                                    src={`https://react-circle-flags.pages.dev/${(COUNTRY_CODES[country] || "un").toLowerCase()}.svg`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{country}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Visa Type *</Label>
                  <Select value={form.visa_type} onValueChange={(v) => handleChangeWithCalc({ visa_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tourist">Tourist</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Transit">Transit</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Process Date</Label>
                  <Input 
                    type="date" 
                    value={form.process_date}
                    onChange={(e) => handleChangeWithCalc({ process_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Application Status</Label>
                  <Select value={form.application_status} onValueChange={(v) => handleChangeWithCalc({ application_status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Documents Required">Documents Required</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Lead Passenger Name</Label>
                  <Input 
                    placeholder="Lead Passenger" 
                    value={form.lead_passenger_name}
                    onChange={(e) => handleChangeWithCalc({ lead_passenger_name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2 bg-secondary/20 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Additional Passenger Names
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPassenger} className="h-8 gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Name
                    </Button>
                  </div>
                  {form.additional_passenger_names.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4 italic">No additional passengers</div>
                  ) : (
                    <div className="space-y-2">
                      {form.additional_passenger_names.map((name: string, index: number) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input 
                            value={name} 
                            onChange={(e) => updatePassenger(index, e.target.value)} 
                            placeholder={`Passenger ${index + 1} Name`}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removePassenger(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Financial Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Selling Price (₹)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={form.selling_price}
                    onChange={(e) => handleChangeWithCalc({ selling_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={form.purchase_price}
                    onChange={(e) => handleChangeWithCalc({ purchase_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visa Fees (₹)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={form.visa_fees}
                    onChange={(e) => handleChangeWithCalc({ visa_fees: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">PROFIT</div>
                  <div className={`text-xl font-bold ${form.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{form.profit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">MARGIN %</div>
                  <div className="text-xl font-bold">
                    {form.margin}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">PENDING AMOUNT</div>
                  <div className="text-xl font-bold text-orange-500">
                    ₹{form.pending_amount.toLocaleString()}
                  </div>
                </div>
              </div>

            </div>

            {/* Other Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Paperclip className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Bank & Remarks</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bank Details</Label>
                  <Input 
                    placeholder="e.g. Paid via HDFC, UTR No." 
                    value={form.bank_details}
                    onChange={(e) => handleChangeWithCalc({ bank_details: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Input 
                    placeholder="Any notes or remarks" 
                    value={form.attachments_and_remarks}
                    onChange={(e) => handleChangeWithCalc({ attachments_and_remarks: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attachment</Label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="document-upload" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAttachedFile(file);
                          toast.success(`Attached: ${file.name}`);
                        }
                      }}
                    />
                    {!attachedFile ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full justify-start font-normal rounded-full bg-orange-100 text-orange-900 hover:bg-orange-200 border-orange-200 border-dashed"
                        onClick={() => document.getElementById("document-upload")?.click()}
                      >
                        <Paperclip className="mr-2 h-4 w-4 text-orange-700" />
                        Attach Document...
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between p-2 px-3 border border-border rounded-full bg-orange-50 text-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Paperclip className="h-4 w-4 text-orange-600 shrink-0" />
                          <span className="truncate text-orange-900 font-medium">{attachedFile.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full shrink-0 ml-2" 
                          onClick={() => setAttachedFile(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-border bg-background flex justify-end gap-3 sticky bottom-0 z-10">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="px-8 shadow-md" style={{ background: "var(--gradient-brand)" }}>
              {initialData ? "Update Booking" : "Save Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
