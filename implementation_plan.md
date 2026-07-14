# Fix Attendance Syncing with Supabase

The `attendance` table in Supabase has the following schema:
- `id`
- `employeeid`
- `date`
- `status`
- `checkin`
- `checkout`
- `created_at`

However, the frontend currently attempts to save fields like `empId`, `clockIn`, `clockOut`, `clockInLocation`, `note`, `name`, `role`, `phone`, and `avatar`. Because these columns do not exist in the database, Supabase rejects the insertion, meaning attendance data never actually gets saved.

## Proposed Changes

### `src/hooks/useSupabaseTable.ts`
- **In `sanitizeRow`**: Map frontend fields to database columns for the `attendance` table (`empId` -> `employeeid`, `clockIn` -> `checkin`, `clockOut` -> `checkout`). Delete non-existent columns before sending to Supabase (`name`, `role`, `phone`, `avatar`, `clockInLocation`, `clockOutLocation`, `note`).
- **In `unSanitizeRow`**: Map database columns back to frontend fields (`employeeid` -> `empId`, `checkin` -> `clockIn`, `checkout` -> `clockOut`).

### `src/routes/crm.attendance.tsx`
- Since `name`, `role`, and `avatar` will no longer be stored directly in the `attendance` table, we will derive them dynamically by matching `empId` against the `employees` data.
- Enhance the `myLogs` and `teamLogsForSelectedDate` variables to merge in the `name`, `role`, and `avatar` from the `employees` list so the UI continues to display correctly.

## Verification
- User can clock in/out and the data will successfully persist to Supabase.
- Team check-ins will correctly display employee names and avatars by cross-referencing the `employees` list.
