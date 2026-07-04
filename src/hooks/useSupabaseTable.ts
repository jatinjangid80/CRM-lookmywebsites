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
    if (tableName === "leads") {
      if (newRow.nextFollowUp) newRow.noteDate = newRow.nextFollowUp;
      if (newRow.whatsapp) newRow.reference = newRow.whatsapp;
      if (newRow.adults !== undefined) newRow.pax = newRow.adults;
      if (newRow.children !== undefined) newRow.queryType = String(newRow.children);

      delete newRow.nextFollowUp;
      delete newRow.whatsapp;
      delete newRow.adults;
      delete newRow.children;
      delete newRow.lastFollowUp;
      delete newRow.createdTime;
      delete newRow.paymentStatus;
    }
    if (tableName === "employees") {
      delete newRow.closedDeals; // not a Supabase column
      delete newRow.notes;       // not a Supabase column

      // Store username & password inside profile_details JSONB
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

      // profile_details is a real JSONB column — store it directly
      // (do NOT pack it into description)
      // allNotes, dob, relationship are not real columns — skip below
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

    // Serialize custom fields into existing columns so they store in Supabase
    // without requiring manual SQL schema migrations.
    const customFields: any = {};
    if (newRow.allNotes !== undefined && tableName !== "employees") customFields.allNotes = newRow.allNotes;
    if (newRow.dob !== undefined && tableName !== "employees") customFields.dob = newRow.dob;
    if (newRow.relationship !== undefined && tableName !== "employees") customFields.relationship = newRow.relationship;
    if (tableName !== "employees" && newRow.profile_details !== undefined) customFields.profile_details = newRow.profile_details;
    if (newRow.leadSection !== undefined) customFields.leadSection = newRow.leadSection;

    const hasCustomFields = Object.keys(customFields).length > 0;

    if (tableName === "leads") {
      if (hasCustomFields) {
        const existingNotes = newRow.notes || "";
        newRow.notes = JSON.stringify({ _isMeta: true, text: existingNotes, ...customFields });
      }
    } else if (tableName === "bookings") {
      if (hasCustomFields) {
        const existingRemarks = newRow.remarks || "";
        newRow.remarks = JSON.stringify({ _isMeta: true, text: existingRemarks, ...customFields });
      }
    } else if (tableName === "customers") {
      if (hasCustomFields) {
        newRow.name = `${newRow.name}---META---${JSON.stringify(customFields)}`;
      }
    } else if (tableName === "employees") {
      // For employees: description stays as plain text
      // profile_details goes directly into the JSONB column (already set above)
      // allNotes is a real JSONB column in Supabase
    }

    delete newRow.allNotes;
    delete newRow.dob;
    delete newRow.relationship;
    if (tableName !== "employees") delete newRow.profile_details;
    delete newRow.leadSection;

    return newRow;
  }

  function unSanitizeRow(row: any) {
    const newRow = { ...row };
    if (tableName === "leads") {
      if (newRow.noteDate) newRow.nextFollowUp = newRow.noteDate;
      if (newRow.reference) newRow.whatsapp = newRow.reference;
      if (newRow.pax !== null) newRow.adults = newRow.pax;
      if (newRow.queryType !== null) newRow.children = Number(newRow.queryType) || 0;
      if (newRow.created_at) {
        const d = new Date(newRow.created_at);
        newRow.createdAt = d.toISOString().slice(0, 10);
        newRow.createdTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
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
    
    if (tableName === "leads" && typeof newRow.notes === "string" && newRow.notes.includes("_isMeta")) {
      try {
        const parsed = JSON.parse(newRow.notes);
        if (parsed._isMeta) {
          newRow.notes = parsed.text;
          if (parsed.allNotes !== undefined) newRow.allNotes = parsed.allNotes;
          if (parsed.dob !== undefined) newRow.dob = parsed.dob;
          if (parsed.relationship !== undefined) newRow.relationship = parsed.relationship;
          if (parsed.leadSection !== undefined) newRow.leadSection = parsed.leadSection;
        }
      } catch (e) {}
    }

    if (tableName === "bookings" && typeof newRow.remarks === "string" && newRow.remarks.includes("_isMeta")) {
      try {
        const parsed = JSON.parse(newRow.remarks);
        if (parsed._isMeta) {
          newRow.remarks = parsed.text;
          if (parsed.allNotes !== undefined) newRow.allNotes = parsed.allNotes;
          if (parsed.dob !== undefined) newRow.dob = parsed.dob;
          if (parsed.relationship !== undefined) newRow.relationship = parsed.relationship;
        }
      } catch (e) {}
    }

    if (tableName === "customers" && typeof newRow.name === "string" && newRow.name.includes("---META---")) {
      try {
        const parts = newRow.name.split("---META---");
        newRow.name = parts[0];
        const parsed = JSON.parse(parts[1]);
        if (parsed.allNotes !== undefined) newRow.allNotes = parsed.allNotes;
        if (parsed.dob !== undefined) newRow.dob = parsed.dob;
        if (parsed.relationship !== undefined) newRow.relationship = parsed.relationship;
      } catch (e) {}
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
      } catch (e) {}
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
