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

export async function login(username: string, password: string): Promise<AuthUser | null> {
  // Credential check now happens entirely server-side via the
  // login_employee() RPC (see supabase/migrations/001_secure_login_rpc.sql). 
  // The client never sees password hashes or anyone else's employee data.
  try {
    const { data, error } = await supabase.rpc("login_employee", {
      p_username: username.trim(),
      p_password: password,
    });

    if (error) {
      console.error("Login RPC error", error);
      return null;
    }

    const match = data?.[0];
    if (!match) return null;

    // Admin role must come only from an explicit role/accessRole field,
    // never inferred from name text.
    const explicitAccessRole = (match.access_role || "").trim().toLowerCase();
    const explicitRole = (match.role || "").trim().toLowerCase();

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
      name: match.name,
      empId: match.emp_id,
      avatar: match.avatar || "",
      email: match.email,
      phone: match.phone,
    };
    setAuth(user);
    return user;
  } catch (e) {
    console.error("Error during login", e);
    return null;
  }
}
