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
        localStorage.setItem(`seeded_${tableName}`, "true");
      } else if (
        initialValue &&
        initialValue.length > 0 &&
        !localStorage.getItem(`seeded_${tableName}`)
      ) {
        // Seed the database with the initial local data if it's completely empty!
        console.log(`Seeding ${tableName} with initial data...`);
        localStorage.setItem(`seeded_${tableName}`, "true");
        const { error: seedError } = await supabase
          .from(tableName)
          .insert(initialValue.map(sanitizeRow));
        if (seedError) {
          console.error(`Error seeding ${tableName}:`, seedError);
        } else {
          // If seeding succeeds, update data so it doesn't require a reload
          const { data: newRemoteData } = await supabase.from(tableName).select("*");
          if (newRemoteData && newRemoteData.length > 0) {
            setData(newRemoteData.map(unSanitizeRow) as T);
          }
        }
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
    if (tableName === "employees") delete newRow.closedDeals;
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
    if (newRow.allNotes !== undefined) customFields.allNotes = newRow.allNotes;
    if (newRow.dob !== undefined) customFields.dob = newRow.dob;
    if (newRow.relationship !== undefined) customFields.relationship = newRow.relationship;

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
      if (hasCustomFields) {
        const existingDesc = newRow.description || "";
        newRow.description = JSON.stringify({ _isMeta: true, text: existingDesc, ...customFields });
      }
    }

    delete newRow.allNotes;
    delete newRow.dob;
    delete newRow.relationship;

    return newRow;
  }

  function unSanitizeRow(row: any) {
    const newRow = { ...row };
    if (tableName === "leads") {
      if (newRow.noteDate) newRow.nextFollowUp = newRow.noteDate;
      if (newRow.reference) newRow.whatsapp = newRow.reference;
      if (newRow.pax !== null) newRow.adults = newRow.pax;
      if (newRow.queryType !== null) newRow.children = Number(newRow.queryType) || 0;
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
      await supabase.from(tableName).delete().eq("id", item.id);
    }

    // Find Insertions (in new, but not in old)
    const toInsert = newArray.filter((item: any) => !oldIds.has(item.id)).map(sanitizeRow);
    if (toInsert.length > 0) {
      // Supabase supports bulk insert
      await supabase.from(tableName).insert(toInsert);
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
      await supabase.from(tableName).update(item).eq("id", item.id);
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
