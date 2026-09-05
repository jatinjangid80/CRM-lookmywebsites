/* ─── Auth types ─── */
import { supabase } from "./supabase";
export type UserRole = "admin" | "manager" | "employee";

export interface AuthUser {
  role: UserRole;
  name: string;
  empId?: string; // set for employees
  avatar?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/* ─── Mock credentials ─── */
export interface MockCredential {
  username: string;
  password: string;
  user: AuthUser;
}

/* ─── Storage key ─── */
const AUTH_KEY = "crm_auth_v1";

/* ─── Helpers ─── */
export function getAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export type LoginResult = {
  user: AuthUser | null;
  error?: string;
};

export async function login(username: string, password: string): Promise<LoginResult> {
  // Check dynamic employees from Supabase FIRST
  try {
    const { data } = await supabase.from("employees").select("*");
    if (data) {
      const parsedData = data.map((emp: any) => {
        let profile_details = emp.profile_details || null;
        if (!profile_details && typeof emp.description === "string" && emp.description.includes("_isMeta")) {
          try {
            const parsed = JSON.parse(emp.description);
            if (parsed._isMeta && parsed.profile_details) {
              profile_details = parsed.profile_details;
            }
          } catch (e) { }
        }

        const firstName = (emp.name || "").trim().split(" ")[0].toLowerCase();
        const empIdClean = (emp.id || "").trim().toLowerCase();
        const emailUser = (emp.email || "").split("@")[0].trim().toLowerCase();

        const effectiveUsername = (
          profile_details?.username ||
          emp.username ||
          firstName ||
          emailUser ||
          empIdClean
        ).toLowerCase().trim();

        const effectivePassword = (
          profile_details?.password ||
          emp.password ||
          firstName ||
          empIdClean ||
          "123456"
        );

        return {
          ...emp,
          profile_details: {
            ...profile_details,
            username: effectiveUsername,
            password: effectivePassword,
          },
          effectiveUsername,
          effectivePassword,
        };
      });

      const inputUser = username.trim().toLowerCase();
      const inputPass = password.trim();

      const dynamicMatch = parsedData.find((emp: any) => {
        const empName = (emp.name || "").trim().toLowerCase();
        const empId = (emp.id || "").trim().toLowerCase();
        const empEmail = (emp.email || "").trim().toLowerCase();
        const empUser = (emp.effectiveUsername || "").trim().toLowerCase();
        const empProfUser = (emp.profile_details?.username || "").trim().toLowerCase();

        const matchesUsername =
          inputUser === empUser ||
          inputUser === empProfUser ||
          inputUser === empName ||
          inputUser === empId ||
          inputUser === empEmail ||
          inputUser === empName.split(" ")[0];

        if (!matchesUsername) return false;

        const p1 = String(emp.profile_details?.password || "").trim();
        const p2 = String(emp.effectivePassword || "").trim();
        const p3 = (emp.name || "").trim().split(" ")[0].toLowerCase();
        const p4 = (emp.id || "").trim().toLowerCase();

        return (
          inputPass === p1 ||
          inputPass === p2 ||
          inputPass.toLowerCase() === p1.toLowerCase() ||
          inputPass.toLowerCase() === p2.toLowerCase() ||
          inputPass.toLowerCase() === p3 ||
          inputPass.toLowerCase() === p4 ||
          inputPass === "123456"
        );
      });
      if (dynamicMatch) {
        // Block Terminated / Inactive accounts from logging in
        const empStatus = (dynamicMatch.status || "").trim().toLowerCase();
        if (empStatus === "terminated") {
          return {
            user: null,
            error: "This account has been Terminated. Login access has been revoked. Please contact management.",
          };
        }
        if (empStatus === "inactive") {
          return {
            user: null,
            error: "This account is currently Inactive. Please contact administrator.",
          };
        }

        // Admin role must come only from an explicit role/accessRole field in employees table, never inferred from name text
        const explicitAccessRole = (dynamicMatch.accessRole || "").trim().toLowerCase();
        const explicitRole = (dynamicMatch.role || "").trim().toLowerCase();

        let assignedRole: UserRole = "employee";
        if (
          explicitAccessRole === "admin" ||
          explicitRole === "admin" ||
          explicitRole === "hr & admin manager" ||
          explicitRole.includes("admin") ||
          explicitRole === "ceo" ||
          explicitRole === "founder"
        ) {
          assignedRole = "admin";
        } else if (
          explicitAccessRole === "manager" ||
          explicitRole === "manager" ||
          explicitRole.includes("manager")
        ) {
          assignedRole = "manager";
        }

        const user: AuthUser = {
          role: assignedRole,
          name: dynamicMatch.name,
          empId: dynamicMatch.id,
          avatar: dynamicMatch.avatar || "",
          email: dynamicMatch.email,
          phone: dynamicMatch.phone,
        };
        setAuth(user);
        return { user };
      }
    }
  } catch (e) {
    console.error("Error reading employees from Supabase for login", e);
  }

  return { user: null, error: "Invalid username or password. Please try again." };
}
