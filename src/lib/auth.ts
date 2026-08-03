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

export async function login(username: string, password: string): Promise<AuthUser | null> {
  // Emergency override for Developer / IT Admin
  if (username.trim().toLowerCase() === "jatin" || username.trim().toLowerCase() === "Manvendra Singhal") {
    const user: AuthUser = {
      role: "admin",
      name: username.trim().toLowerCase() === "jatin" ? "Jatin Jangid" : "Manvendra Singhal",
      avatar: "",
    };
    setAuth(user);
    return user;
  }

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
        return { ...emp, profile_details };
      });

      const dynamicMatch = parsedData.find(
        (emp: any) =>
          emp.profile_details?.username &&
          emp.profile_details.username.toLowerCase() === username.trim().toLowerCase() &&
          emp.profile_details.password === password,
      );
      if (dynamicMatch) {
        let accessRole = dynamicMatch.accessRole
          ? dynamicMatch.accessRole.toLowerCase()
          : "employee";
          
        if (
          dynamicMatch.role === "HR & Admin Manager" ||
          dynamicMatch.role?.toLowerCase().includes("admin") ||
          dynamicMatch.role?.toLowerCase().includes("ceo") ||
          dynamicMatch.role?.toLowerCase().includes("founder") ||
          dynamicMatch.name?.toLowerCase().includes("manvendra") ||
          dynamicMatch.name?.toLowerCase().includes("jatin") ||
          dynamicMatch.name?.toLowerCase().includes("aman")
        ) {
          accessRole = "admin";
        }
        const user: AuthUser = {
          role: accessRole as UserRole,
          name: dynamicMatch.name,
          empId: dynamicMatch.id,
          avatar: dynamicMatch.avatar || "",
          email: dynamicMatch.email,
          phone: dynamicMatch.phone,
        };
        setAuth(user);
        return user;
      }
    }
  } catch (e) {
    console.error("Error reading employees from Supabase for login", e);
  }

  return null;
}
