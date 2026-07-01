import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  INITIAL_EMPLOYEE_DETAILS,
  createDefaultEmployeeDetails,
  type EmployeeDetails,
} from "@/lib/employee-profile-defaults";
import { INITIAL_EMPLOYEES } from "@/routes/crm.employees";

const STATUS_COLOR = {
  Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "On Leave": "bg-amber-100 text-amber-800 border-amber-200",
  Inactive: "bg-slate-100 text-slate-800 border-slate-200",
};

export function EmployeeProfileCard({ employeeName }: { employeeName: string }) {
  const [imgError, setImgError] = useState(false);
  const [localEmployees] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;

  let employee = employees.find(
    (e) =>
      (e.name &&
        employeeName &&
        (e.name === employeeName ||
          e.name.toLowerCase() === employeeName.toLowerCase() ||
          e.name.toLowerCase().includes(employeeName.toLowerCase()) ||
          employeeName.toLowerCase().includes(e.name.toLowerCase()))) ||
      e.id === employeeName,
  );

  if (!employee) {
    employee = INITIAL_EMPLOYEES.find(
      (e) =>
        e.name === employeeName ||
        e.name.toLowerCase() === employeeName.toLowerCase() ||
        e.name.toLowerCase().includes(employeeName.toLowerCase()) ||
        employeeName.toLowerCase().includes(e.name.toLowerCase()) ||
        e.id === employeeName,
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{employeeName}</p>
          <p className="text-xs text-muted-foreground">Assignee details not found</p>
        </div>
      </div>
    );
  }

  const empDetails: EmployeeDetails =
    employee.profile_details ||
    createDefaultEmployeeDetails(
      employee.id,
      employee.name,
      employee.role,
      employee.email,
      employee.phone,
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center sm:justify-start gap-4">
      {imgError || !employee.avatar ? (
        <div className="h-16 w-16 rounded-2xl bg-gray-100 border border-gray-200 ring-4 ring-[#FF6B00]/10 flex items-center justify-center shrink-0">
          <User className="h-8 w-8 text-gray-400" />
        </div>
      ) : (
        <img
          src={employee.avatar}
          alt={employee.name}
          onError={() => setImgError(true)}
          className="h-16 w-16 rounded-2xl object-cover border border-gray-200 ring-4 ring-[#FF6B00]/10 shrink-0"
        />
      )}
      <div className="text-center sm:text-left space-y-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h3 className="text-lg font-bold font-display text-gray-900">{employee.name}</h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[employee.status as keyof typeof STATUS_COLOR] || "bg-slate-100"}`}
          >
            {employee.status}
          </span>
        </div>
        <p className="text-[#FF6B00] font-semibold text-xs">
          {employee.role} • {empDetails.department}
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" /> {employee.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> {employee.phone}
          </span>
        </div>
      </div>
    </div>
  );
}
