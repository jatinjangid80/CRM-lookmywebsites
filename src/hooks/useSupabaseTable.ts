import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/**
 * A drop-in replacement for useLocalStorage that syncs data with Supabase.
 * It does optimistic UI updates and diffs the array to figure out inserts/updates/deletes.
 */
export function useSupabaseTable<T extends Array<any>>(
  tableName: string,
  initialValue: T
) {
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
        setData(remoteData.map(fromDB) as T);
      } else if (initialValue && initialValue.length > 0) {
        // Seed the database with the initial local data if it's completely empty!
        console.log(`Seeding ${tableName} with initial data...`);
        const { error: seedError } = await supabase.from(tableName).insert(initialValue.map(toDB));
        if (seedError) {
          console.error(`Error seeding ${tableName}:`, seedError);
        }
      }
      setIsLoaded(true);
    }
    fetchData();
  }, [tableName]);

  const keyMappings: Record<string, string> = {
    joinDate: 'joindate', closedDeals: 'closeddeals', recentActivity: 'recentactivity', accessRole: 'accessrole',
    contactPerson: 'contactperson', dueDate: 'duedate', visaType: 'visatype', appliedOn: 'appliedon',
    travelDate: 'traveldate', embassyRef: 'embassyref', employeeId: 'employeeid', startDate: 'startdate',
    endDate: 'enddate', checkIn: 'checkin', checkOut: 'checkout', uploadedAt: 'uploadedat',
    serialNumber: 'serialnumber', assignedDate: 'assigneddate', issuedBy: 'issuedby', issueDate: 'issuedate',
    expiryDate: 'expirydate'
  };
  const reverseKeyMappings = Object.fromEntries(Object.entries(keyMappings).map(([k, v]) => [v, k]));

  function toDB(row: any) {
    const newRow = { ...row };
    if (tableName === 'employees') delete newRow.closedDeals;
    if (tableName === 'certificates' && newRow.date) { newRow.issueDate = newRow.date; delete newRow.date; }
    if (tableName === 'leaves' && newRow.empId) { newRow.employeeId = newRow.empId; delete newRow.empId; }
    if (tableName === 'assets' && newRow.date) { newRow.assignedDate = newRow.date; delete newRow.date; }
    if (tableName === 'payroll' && newRow.date) { newRow.month = newRow.date; delete newRow.date; }
    if (tableName === 'feeds') delete newRow.avatar;
    if (tableName === 'hr_files' && newRow.date) { newRow.uploadedAt = newRow.date; delete newRow.date; }
    if (tableName === 'timelogs' && newRow.employee) { newRow.employeeId = newRow.employee; delete newRow.employee; }
    if (tableName === 'packages') delete newRow.active;
    if (tableName === 'reviews' && newRow.empId) { newRow.employeeId = newRow.empId; delete newRow.empId; }
    
    // Map camelCase to Postgres lowercase
    for (const key of Object.keys(newRow)) {
      if (keyMappings[key]) {
        newRow[keyMappings[key]] = newRow[key];
        delete newRow[key];
      }
    }
    return newRow;
  }

  function fromDB(row: any) {
    const newRow = { ...row };
    for (const key of Object.keys(newRow)) {
      if (reverseKeyMappings[key]) {
        newRow[reverseKeyMappings[key]] = newRow[key];
        delete newRow[key];
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
      await supabase.from(tableName).delete().eq("id", item.id);
    }

    // Find Insertions (in new, but not in old)
    const toInsert = newArray.filter((item: any) => !oldIds.has(item.id)).map(toDB);
    if (toInsert.length > 0) {
      // Supabase supports bulk insert
      await supabase.from(tableName).insert(toInsert);
    }

    // Find Updates
    const toUpdate = newArray.filter((item: any) => {
      if (!oldIds.has(item.id)) return false; 
      const oldItem = oldArray.find((old: any) => old.id === item.id);
      return oldItem !== item;
    }).map(toDB);

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
    [tableName]
  );

  return [data, setSupabaseData, isLoaded] as const;
}
