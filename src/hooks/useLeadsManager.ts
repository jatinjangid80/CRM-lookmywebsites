import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ExtLead } from "@/routes/crm.leads"; // we will export it

export function useLeadsManager() {
  const [leads, setLeadsState] = useState<ExtLead[]>([]);

  useEffect(() => {
    fetchLeads();
    
    // Subscribe to leads
    const channel = supabase.channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads(); // Simplest way to handle joins is just refetch
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); }
  }, []);

  async function fetchLeads() {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) {
      console.error('[leads] fetch error:', error);
      return;
    }
    
    const mapped = data.map(row => {
      let notes = row.notes;
      let extra: any = {};
      try {
        const parsed = JSON.parse(notes);
        if (parsed && parsed._isMeta) {
          notes = parsed.text || "";
          extra = parsed;
          delete extra._isMeta;
          delete extra.text;
        }
      } catch (e) {}

      // allNotes: recover from row.allNotes if present
      const allNotes = Array.isArray(row.allNotes) ? row.allNotes.filter((n: any) => !n._isMeta) : [];

      return {
        id: row.id,
        name: row.name || "",
        phone: row.phone || "",
        email: row.email || "",
        destination: row.destination || "",
        budget: row.budget || 0,
        travelDate: row.travelDate || "",
        status: row.status || "New Lead",
        adults: row.pax || 2,
        children: 0,
        pax: row.pax || 2,
        createdAt: row.created_at?.slice(0, 10),
        createdTime: row.created_at ? new Date(row.created_at).toLocaleTimeString() : "",
        notes: notes || "",
        allNotes,
        avatar: "",
        source: row.source || extra.source || "",
        reference: row.reference || extra.reference || "",
        assignedTo: row.assignedTo || extra.assignedTo || "",
        service: row.service || extra.service || "",
        priority: row.priority || extra.priority || "Medium",
        packageType: row.packageType || extra.packageType || "",
        insuranceDate: row.insuranceDate || extra.insuranceDate || "",
        policyType: row.policyType || extra.policyType || "",
        queryType: row.queryType || extra.queryType || "",
        clientCompany: row.clientCompany || extra.clientCompany || "",
        expiryDate: row.expiryDate || extra.expiryDate || "",
        totalAmount: row.totalAmount || extra.totalAmount,
        amountPaid: row.amountPaid || extra.amountPaid,
        vendorName: row.vendorName || extra.vendorName || "",
        bookingReference: row.bookingReference || extra.bookingReference || "",
        paymentStatus: row.paymentStatus || extra.paymentStatus,
        whatsapp: extra.whatsapp,
        lastFollowUp: extra.lastFollowUp,
        nextFollowUp: extra.nextFollowUp,
      } as ExtLead;
    });
    setLeadsState(mapped);
  }

  // We return a proxy setLeads that intercepts mutations
  const setLeads = (updater: ExtLead[] | ((prev: ExtLead[]) => ExtLead[])) => {
    setLeadsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      syncToDb(prev, next);
      return next;
    });
  };

  function buildLeadRow(item: ExtLead) {
    return {
      name: item.name || "",
      phone: item.phone || "",
      email: item.email || "",
      destination: item.destination || "",
      budget: item.budget || 0,
      travelDate: item.travelDate || null,
      status: item.status || "New Lead",
      pax: item.pax || item.adults || 2,
      source: item.source || "",
      reference: item.reference || "",
      assignedTo: item.assignedTo || "",
      service: item.service || "",
      priority: item.priority || "Medium",
      packageType: item.packageType || "",
      insuranceDate: item.insuranceDate || null,
      policyType: item.policyType || "",
      queryType: item.queryType || "",
      clientCompany: item.clientCompany || "",
      expiryDate: item.expiryDate || null,
      totalAmount: item.totalAmount || null,
      amountPaid: item.amountPaid || null,
      vendorName: item.vendorName || "",
      bookingReference: item.bookingReference || "",
      paymentStatus: item.paymentStatus || null,
      allNotes: Array.isArray(item.allNotes) ? item.allNotes.filter((n: any) => !n._isMeta) : [],
      notes: item.notes || "",
    };
  }

  async function syncToDb(oldLeads: ExtLead[], newLeads: ExtLead[]) {
    const oldIds = new Set(oldLeads.map(l => l.id));
    const newIds = new Set(newLeads.map(l => l.id));

    // Deletes
    const toDelete = oldLeads.filter(l => !newIds.has(l.id));
    for (const item of toDelete) {
      const { error } = await supabase.from('leads').delete().eq('id', item.id);
      if (error) console.error('[leads] DELETE error:', error.message);
    }

    // Inserts
    const toInsert = newLeads.filter(l => !oldIds.has(l.id));
    for (const item of toInsert) {
      const row = buildLeadRow(item);
      const { error } = await supabase.from('leads').insert({ id: item.id, ...row });
      if (error) console.error('[leads] INSERT error:', error.message, error.details, row);
    }

    // Updates
    const toUpdate = newLeads.filter(l => {
      if (!oldIds.has(l.id)) return false;
      return l !== oldLeads.find(o => o.id === l.id);
    });
    for (const item of toUpdate) {
      const row = buildLeadRow(item);
      const { error } = await supabase.from('leads').update(row).eq('id', item.id);
      if (error) console.error('[leads] UPDATE error:', error.message, error.details);
    }
  }

  return [leads, setLeads] as const;
}
