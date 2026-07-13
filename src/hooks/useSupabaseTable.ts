import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/**
 * A drop-in replacement for useLocalStorage that syncs data with Supabase.
 * It does optimistic UI updates and diffs the array to figure out inserts/updates/deletes.
 */
export function useSupabaseTable<T extends Array<any>>(tableName: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      const { data: remoteData, error } = await supabase.from(tableName).select("*");
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return;
      }

      if (remoteData && remoteData.length > 0) {
        setData(remoteData.map(unSanitizeRow) as T);
      } else {
        setData([] as any);
      }
      setIsLoaded(true);
    }
    fetchData();

    // Subscribe to realtime changes
    const channelId = `${tableName}_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on("postgres_changes", { event: "*", schema: "public", table: tableName }, (payload) => {
        if (payload.eventType === "INSERT") {
          setData((prev) => {
            if (prev.some((item: any) => item.id === payload.new.id)) return prev;
            return [...prev, unSanitizeRow(payload.new) as any] as T;
          });
        } else if (payload.eventType === "DELETE") {
          setData((prev) => prev.filter((item: any) => item.id !== payload.old.id) as T);
        } else if (payload.eventType === "UPDATE") {
          setData(
            (prev) =>
              prev.map((item: any) =>
                item.id === payload.new.id ? unSanitizeRow(payload.new) : item,
              ) as T,
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  function sanitizeRow(row: any) {
    const newRow = { ...row };

    if (tableName === "customers") {
      if (newRow.customer_name !== undefined) newRow.name = newRow.customer_name;

      // Store address and reference_name in allNotes as JSON metadata
      const meta: any = {};
      if (newRow.address) meta.address = newRow.address;
      if (newRow.reference_name) meta.reference_name = newRow.reference_name;
      if (Object.keys(meta).length > 0) {
        const existing = Array.isArray(newRow.allNotes) ? newRow.allNotes : [];
        const metaEntry = { _isMeta: true, ...meta };
        // Replace any existing meta entry
        const filtered = existing.filter((n: any) => !n._isMeta);
        newRow.allNotes = [metaEntry, ...filtered];
      }

      delete newRow.customer_name;
      delete newRow.address;
      delete newRow.reference_name;
    }

    if (tableName === "employees") {
      delete newRow.closedDeals;
      delete newRow.notes;
      if (newRow.username || newRow.password) {
        const existingDetails = newRow.profile_details || {};
        newRow.profile_details = {
          ...existingDetails,
          username: newRow.username,
          password: newRow.password,
        };
        delete newRow.username;
        delete newRow.password;
      }
    }
    if (tableName === "certificates" && newRow.date) {
      newRow.issueDate = newRow.date;
      delete newRow.date;
    }
    if (tableName === "leaves" && newRow.empId) {
      newRow.employeeId = newRow.empId;
      delete newRow.empId;
    }
    if (tableName === "assets" && newRow.date) {
      newRow.assignedDate = newRow.date;
      delete newRow.date;
    }
    if (tableName === "payroll" && newRow.date) {
      newRow.month = newRow.date;
      delete newRow.date;
    }
    if (tableName === "feeds") delete newRow.avatar;
    if (tableName === "hr_files" && newRow.date) {
      newRow.uploadedAt = newRow.date;
      delete newRow.date;
    }
    if (tableName === "timelogs" && newRow.employee) {
      newRow.employeeId = newRow.employee;
      delete newRow.employee;
    }
    if (tableName === "packages") delete newRow.active;
    if (tableName === "reviews" && newRow.empId) {
      newRow.employeeId = newRow.empId;
      delete newRow.empId;
    }

    if (tableName === "tasks") {
      const customFields: any = {};
      if (newRow.task_type) customFields.task_type = newRow.task_type;
      if (newRow.parent_id) customFields.parent_id = newRow.parent_id;
      if (newRow.notes) customFields.notes = newRow.notes;
      if (newRow.attachments) customFields.attachments = newRow.attachments;
      if (newRow.customer_id) customFields.customer_id = newRow.customer_id;
      if (newRow.booking_id) customFields.booking_id = newRow.booking_id;
      if (newRow.progress !== undefined) customFields.progress = newRow.progress;
      if (newRow.start_date) customFields.start_date = newRow.start_date;
      if (newRow.completed_at) customFields.completed_at = newRow.completed_at;
      if (newRow.task_number) customFields.task_number = newRow.task_number;
      if (newRow.created_by) customFields.created_by = newRow.created_by;

      if (Object.keys(customFields).length > 0) {
        newRow.note = JSON.stringify({
          _isMeta: true,
          text: newRow.description || "",
          ...customFields
        });
      } else if (newRow.description !== undefined) {
        newRow.note = newRow.description;
      }

      if (newRow.task_type !== undefined) newRow.type = newRow.task_type;
      if (newRow.assigned_to !== undefined) newRow.assignee = newRow.assigned_to;
      if (newRow.due_date !== undefined) newRow.dueDate = newRow.due_date;

      delete newRow.task_type;
      delete newRow.notes;
      delete newRow.assigned_to;
      delete newRow.due_date;
      delete newRow.customer_id;
      delete newRow.booking_id;
      delete newRow.progress;
      delete newRow.start_date;
      delete newRow.completed_at;
      delete newRow.task_number;
      delete newRow.created_by;
      delete newRow.attachments;
      delete newRow.parent_id;
      delete newRow.description;
    }

    if (tableName === "attendance") {
      if (newRow.empId) newRow.employeeid = newRow.empId;
      if (newRow.clockIn) newRow.checkin = newRow.clockIn;
      if (newRow.clockOut) newRow.checkout = newRow.clockOut;

      delete newRow.empId;
      delete newRow.clockIn;
      delete newRow.clockOut;
      delete newRow.name;
      delete newRow.role;
      delete newRow.phone;
      delete newRow.avatar;
      delete newRow.clockInLocation;
      delete newRow.clockOutLocation;
      delete newRow.note;
    }

    if (tableName === "vendors") {
      const customFields: any = {};
      if (newRow.website) customFields.website = newRow.website;
      if (newRow.bank_name) customFields.bank_name = newRow.bank_name;
      if (newRow.account_number) customFields.account_number = newRow.account_number;
      if (newRow.ifsc) customFields.ifsc = newRow.ifsc;
      if (newRow.upi) customFields.upi = newRow.upi;

      if (Object.keys(customFields).length > 0) {
        newRow.notes = JSON.stringify({
          _isMeta: true,
          ...customFields
        });
      }

      if (newRow.vendor_name !== undefined) newRow.name = newRow.vendor_name;
      if (newRow.vendor_type !== undefined) newRow.category = newRow.vendor_type;
      if (newRow.contact_person !== undefined) {
        newRow.contactperson = newRow.contact_person;
        newRow.contactPerson = newRow.contact_person;
      }
      if (newRow.city !== undefined) newRow.location = newRow.city;

      delete newRow.vendor_name;
      delete newRow.vendor_type;
      delete newRow.contact_person;
      delete newRow.city;
      delete newRow.website;
      delete newRow.bank_name;
      delete newRow.account_number;
      delete newRow.ifsc;
      delete newRow.upi;
    }

    if (tableName === "leaves") {
      if (newRow.empId) newRow.employeeid = newRow.empId;
      if (newRow.fromDate) newRow.startdate = newRow.fromDate;
      if (newRow.toDate) newRow.enddate = newRow.toDate;

      delete newRow.empId;
      delete newRow.empName;
      delete newRow.fromDate;
      delete newRow.toDate;
      delete newRow.appliedDate;
    }

    return newRow;
  }

  function unSanitizeRow(row: any) {
    const newRow = { ...row };

    if (tableName === "customers") {
      if (newRow.name !== undefined) newRow.customer_name = newRow.name;

      // Recover address and reference_name from allNotes metadata
      if (Array.isArray(newRow.allNotes)) {
        const metaEntry = newRow.allNotes.find((n: any) => n._isMeta);
        if (metaEntry) {
          if (metaEntry.address !== undefined) newRow.address = metaEntry.address;
          if (metaEntry.reference_name !== undefined) newRow.reference_name = metaEntry.reference_name;
          newRow.allNotes = newRow.allNotes.filter((n: any) => !n._isMeta);
        }
      }
    }

    if (tableName === "certificates" && newRow.issueDate) {
      newRow.date = newRow.issueDate;
    }
    if (tableName === "leaves" && newRow.employeeId) {
      newRow.empId = newRow.employeeId;
    }
    if (tableName === "assets" && newRow.assignedDate) {
      newRow.date = newRow.assignedDate;
    }
    if (tableName === "payroll" && newRow.month) {
      newRow.date = newRow.month;
    }
    if (tableName === "hr_files" && newRow.uploadedAt) {
      newRow.date = newRow.uploadedAt;
    }
    if (tableName === "timelogs" && newRow.employeeId) {
      newRow.employee = newRow.employeeId;
    }
    if (tableName === "reviews" && newRow.employeeId) {
      newRow.empId = newRow.employeeId;
    }
    if (tableName === "attendance") {
      if (newRow.employeeid) newRow.empId = newRow.employeeid;
      if (newRow.checkin) newRow.clockIn = newRow.checkin;
      if (newRow.checkout) newRow.clockOut = newRow.checkout;
    }
    if (tableName === "leaves") {
      if (newRow.employeeid) newRow.empId = newRow.employeeid;
      if (newRow.startdate) newRow.fromDate = newRow.startdate;
      if (newRow.enddate) newRow.toDate = newRow.enddate;
      if (newRow.created_at) newRow.appliedDate = newRow.created_at;
    }

    if (tableName === "vendors") {
      if (newRow.name !== undefined) newRow.vendor_name = newRow.name;
      if (newRow.category !== undefined) newRow.vendor_type = newRow.category;
      if (newRow.contactperson !== undefined) newRow.contact_person = newRow.contactperson;
      if (newRow.contactPerson !== undefined && newRow.contact_person === undefined) newRow.contact_person = newRow.contactPerson;
      if (newRow.location !== undefined) newRow.city = newRow.location;

      if (typeof newRow.notes === "string" && newRow.notes.includes("_isMeta")) {
        try {
          const parsed = JSON.parse(newRow.notes);
          if (parsed._isMeta) {
            if (parsed.website !== undefined) newRow.website = parsed.website;
            if (parsed.bank_name !== undefined) newRow.bank_name = parsed.bank_name;
            if (parsed.account_number !== undefined) newRow.account_number = parsed.account_number;
            if (parsed.ifsc !== undefined) newRow.ifsc = parsed.ifsc;
            if (parsed.upi !== undefined) newRow.upi = parsed.upi;
          }
        } catch (e) { }
      }
    }

    if (tableName === "employees" && typeof newRow.description === "string" && newRow.description.includes("_isMeta")) {
      try {
        const parsed = JSON.parse(newRow.description);
        if (parsed._isMeta) {
          newRow.description = parsed.text;
          if (parsed.allNotes !== undefined) newRow.allNotes = parsed.allNotes;
          if (parsed.dob !== undefined) newRow.dob = parsed.dob;
          if (parsed.relationship !== undefined) newRow.relationship = parsed.relationship;
          if (parsed.profile_details !== undefined) newRow.profile_details = parsed.profile_details;
        }
      } catch (e) { }
    }

    if (tableName === "tasks") {
      if (newRow.type !== undefined) newRow.task_type = newRow.type;
      if (newRow.assignee !== undefined) newRow.assigned_to = newRow.assignee;
      if (newRow.dueDate !== undefined) newRow.due_date = newRow.dueDate;

      if (newRow.note !== undefined) {
        newRow.description = newRow.note;
      }
    }

    if (tableName === "tasks" && typeof newRow.description === "string" && newRow.description.includes("_isMeta")) {
      try {
        const parsed = JSON.parse(newRow.description);
        if (parsed._isMeta) {
          newRow.description = parsed.text;
          if (parsed.task_type !== undefined) newRow.task_type = parsed.task_type;
          if (parsed.parent_id !== undefined) newRow.parent_id = parsed.parent_id;
          if (parsed.notes !== undefined) newRow.notes = parsed.notes;
          if (parsed.attachments !== undefined) newRow.attachments = parsed.attachments;
          if (parsed.customer_id !== undefined) newRow.customer_id = parsed.customer_id;
          if (parsed.booking_id !== undefined) newRow.booking_id = parsed.booking_id;
          if (parsed.progress !== undefined) newRow.progress = parsed.progress;
          if (parsed.start_date !== undefined) newRow.start_date = parsed.start_date;
          if (parsed.completed_at !== undefined) newRow.completed_at = parsed.completed_at;
          if (parsed.task_number !== undefined) newRow.task_number = parsed.task_number;
          if (parsed.created_by !== undefined) newRow.created_by = parsed.created_by;
        }
      } catch (e) { }
    }

    // Safety guard: notes must always be an array - handle broken data from a past bad commit
    if (tableName === "tasks") {
      if (typeof newRow.notes === "string") {
        try {
          const parsedNotes = JSON.parse(newRow.notes);
          if (parsedNotes && parsedNotes._isMeta) {
            // This was a bad meta payload accidentally written to notes column - recover fields
            if (parsedNotes.task_type !== undefined && !newRow.task_type) newRow.task_type = parsedNotes.task_type;
            if (parsedNotes.parent_id !== undefined && !newRow.parent_id) newRow.parent_id = parsedNotes.parent_id;
            if (parsedNotes.attachments !== undefined) newRow.attachments = parsedNotes.attachments;
            if (parsedNotes.customer_id !== undefined) newRow.customer_id = parsedNotes.customer_id;
            if (parsedNotes.booking_id !== undefined) newRow.booking_id = parsedNotes.booking_id;
            if (parsedNotes.progress !== undefined) newRow.progress = parsedNotes.progress;
            if (parsedNotes.start_date !== undefined) newRow.start_date = parsedNotes.start_date;
            if (parsedNotes.completed_at !== undefined) newRow.completed_at = parsedNotes.completed_at;
            if (parsedNotes.task_number !== undefined) newRow.task_number = parsedNotes.task_number;
            if (parsedNotes.created_by !== undefined) newRow.created_by = parsedNotes.created_by;
            if (parsedNotes.description !== undefined && !newRow.description) newRow.description = parsedNotes.description;
            newRow.notes = []; // reset notes to empty array
          } else if (Array.isArray(parsedNotes)) {
            newRow.notes = parsedNotes;
          } else {
            newRow.notes = [];
          }
        } catch (e) {
          newRow.notes = []; // not valid JSON, reset
        }
      } else if (!Array.isArray(newRow.notes)) {
        newRow.notes = [];
      }
    }

    return newRow;
  }

  // Sync mutations back to Supabase
  const syncToSupabase = async (oldArray: T, newArray: T) => {
    const oldIds = new Set(oldArray.map((item: any) => item.id));
    const newIds = new Set(newArray.map((item: any) => item.id));

    // Find Deletions (in old, but not in new)
    const toDelete = oldArray.filter((item: any) => !newIds.has(item.id));
    for (const item of toDelete) {
      const { error } = await supabase.from(tableName).delete().eq("id", item.id);
      if (error) console.error(`[${tableName}] DELETE error:`, error.message, error.details);
    }

    // Find Insertions (in new, but not in old)
    const toInsert = newArray.filter((item: any) => !oldIds.has(item.id)).map(sanitizeRow);
    if (toInsert.length > 0) {
      console.log(`[${tableName}] Inserting rows:`, JSON.stringify(toInsert, null, 2));
      const { error, data } = await supabase.from(tableName).insert(toInsert).select();
      if (error) {
        console.error(`[${tableName}] INSERT error:`, error.message, error.details, error.hint);
      } else {
        console.log(`[${tableName}] INSERT success:`, data);
      }
    }

    // Find Updates
    const toUpdate = newArray
      .filter((item: any) => {
        if (!oldIds.has(item.id)) return false;
        const oldItem = oldArray.find((old: any) => old.id === item.id);
        return oldItem !== item;
      })
      .map(sanitizeRow);

    for (const item of toUpdate) {
      console.log(`[${tableName}] Updating row:`, JSON.stringify(item, null, 2));
      const { error, data } = await supabase.from(tableName).update(item).eq("id", item.id).select();
      if (error) {
        console.error(`[${tableName}] UPDATE error:`, error.message, error.details, error.hint);
      } else {
        console.log(`[${tableName}] UPDATE success:`, data);
      }
    }
  };

  const setSupabaseData = useCallback(
    (value: T | ((val: T) => T)) => {
      setData((prevData) => {
        const newData = value instanceof Function ? value(prevData) : value;
        // Optimistically update state
        // Then sync to Supabase asynchronously
        syncToSupabase(prevData, newData).catch((err) => {
          console.error(`Error syncing ${tableName} to Supabase:`, err);
        });
        return newData;
      });
    },
    [tableName],
  );

  return [data, setSupabaseData, isLoaded] as const;
}
